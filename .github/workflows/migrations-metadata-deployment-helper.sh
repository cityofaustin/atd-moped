#!/usr/bin/env bash

case "${BRANCH_NAME}" in
"production")
  export WORKING_STAGE="production"
  ;;
*)
  export WORKING_STAGE="staging"
  ;;
esac

echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}"
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}"

################################################################################
# JOB: apply-migrations-and-metadata
# Functions for downloading Hasura settings and applying migrations/metadata
################################################################################

#
# Download the Hasura settings from the AWS Secrets Manager
#
function download_hasura_settings() {
  echo "Downloading Hasura Settings: ${WORKING_STAGE}";

  if [[ "${WORKING_STAGE}" == "production" ]]; then
    export AWS_HASURA_CONFIGURATION="${AWS_MOPED_HASURA_CONFIGURATION_FILE_PRODUCTION}";
  else
    export AWS_HASURA_CONFIGURATION="${AWS_MOPED_HASURA_CONFIGURATION_FILE_STAGING}";
  fi;

  aws secretsmanager get-secret-value \
  --secret-id "${AWS_HASURA_CONFIGURATION}" | \
  jq -rc ".SecretString" > config.yaml;
}

#
# Applies migrations and metadata to the Hasura instance
#
function run_migration() {
  echo "----- MIGRATIONS STARTED -----";
  hasura --skip-update-check version;
  echo "Applying migration";
  hasura migrate apply \
    --skip-update-check \
    --disable-interactive \
    --database-name default;
  echo "Applying metadata";
  hasura metadata apply \
    --skip-update-check;
  echo "----- MIGRATIONS FINISHED -----";
}

#
# Controls the migration process (main entry point for migrations job)
#
function run_migration_process() {
  cd ./moped-database;
  echo "Running migration process @ ${PWD}"
  download_hasura_settings;
  run_migration;
}

################################################################################
# JOB: update-ecs-task-deployment
# Functions for validating and deploying ECS task definitions
################################################################################

#
# Determines which ECS task definition file to use based on the branch
# Sets TD_FILE and ENVIRONMENT variables
#
function determine_task_definition_file() {
  echo "Branch name: ${BRANCH_NAME}";

  # Determine environment based on branch
  if [ "${BRANCH_NAME}" = "production" ]; then
    export ENVIRONMENT="production"
    export TD_FILE="moped-database/ecs_task_definitions/production.graphql-engine.ecs-td.json"
    export FAMILY="atd-moped-production"
    export CLUSTER="atd-moped-cluster-production"
  else
    export ENVIRONMENT="staging"
    export TD_FILE="moped-database/ecs_task_definitions/staging.graphql-engine.ecs-td.json"
    export FAMILY="atd-moped-staging"
    export CLUSTER="atd-moped-cluster-staging"
  fi

  export SERVICE="graphql-engine"

  echo "Environment: ${ENVIRONMENT}";
  echo "Cluster: ${CLUSTER}";
  echo "Service: ${SERVICE}";
  echo "Family: ${FAMILY}";
  echo "Task definition file: ${TD_FILE}";
}

#
# Compares the local task definition file with the one currently in AWS
# Returns 0 if different (needs update), 1 if identical (no update needed)
#
function check_task_definition_differs() {
  echo "Fetching current task definition from AWS for family: ${FAMILY}...";

  # Describe the current task definition from AWS
  # If this is the first task definition, the command will fail and we'll register it
  if ! aws ecs describe-task-definition \
    --task-definition ${FAMILY} \
    --output json > /tmp/aws-task-def.json 2>/dev/null; then
    echo "No existing task definition found in AWS, will register new one";
    return 0;
  fi

  echo "Extracting task definition from AWS response...";

  # Extract just the taskDefinition object and remove AWS-managed fields
  # These fields are added by AWS and shouldn't be compared
  jq --sort-keys '.taskDefinition | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy, .deregisteredAt, .tags)' \
    /tmp/aws-task-def.json > /tmp/aws-task-def-normalized.json

  # Normalize the local file the same way (remove the same fields if present)
  jq --sort-keys 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy, .deregisteredAt, .tags)' \
    ${TD_FILE} > /tmp/local-task-def-normalized.json

  echo "Comparing local task definition with AWS version...";

  # Compare the normalized JSON files
  if diff -q /tmp/aws-task-def-normalized.json /tmp/local-task-def-normalized.json > /dev/null; then
    echo "Task definitions are identical, no update needed";
    return 1;
  else
    echo "✓ Task definitions differ, update needed";
    echo "";
    echo "========================================";
    echo "Differences (AWS version vs Local file):";
    echo "========================================";
    diff -u /tmp/aws-task-def-normalized.json /tmp/local-task-def-normalized.json || true
    echo "========================================";
    echo "";
    return 0;
  fi
}

#
# Deregisters old task definitions, keeping only the last 3 active ones
#
function cleanup_old_task_definitions() {
  echo "Cleaning up old task definitions for family: ${FAMILY}...";

  # List all ACTIVE task definition revisions for this family, sorted by revision number
  local active_revisions=$(aws ecs list-task-definitions \
    --family-prefix ${FAMILY} \
    --status ACTIVE \
    --sort DESC \
    --output json | jq -r '.taskDefinitionArns[]')

  if [ -z "$active_revisions" ]; then
    echo "No active task definitions found to clean up";
    return 0;
  fi

  # Count total active revisions
  local total_count=$(echo "$active_revisions" | wc -l | tr -d ' ')
  echo "Found ${total_count} active task definition(s)";

  # If we have 3 or fewer, no cleanup needed
  if [ "$total_count" -le 3 ]; then
    echo "Only ${total_count} active revision(s), no cleanup needed";
    return 0;
  fi

  # Skip the first 3 (most recent) and deregister the rest
  local to_deregister=$(echo "$active_revisions" | tail -n +4)
  local deregister_count=$(echo "$to_deregister" | wc -l | tr -d ' ')

  echo "Deregistering ${deregister_count} old revision(s), keeping the 3 most recent...";

  while IFS= read -r task_def_arn; do
    if [ -n "$task_def_arn" ]; then
      echo "Deregistering: ${task_def_arn}";
      if aws ecs deregister-task-definition --task-definition "${task_def_arn}" > /dev/null; then
        echo "  ✓ Deregistered successfully";
      else
        echo "  ✗ Failed to deregister";
      fi
    fi
  done <<< "$to_deregister"

  echo "Cleanup complete!";
}

#
# Registers the ECS task definition using AWS CLI
# Returns 0 if successful, exits with error if registration fails or file not found
# Returns 1 if no registration was needed (file unchanged)
#
function register_task_definition() {
  # Check if task definition file exists
  if [ ! -f "${TD_FILE}" ]; then
    echo "Task definition file not found: ${TD_FILE}";
    echo "Skipping ECS task definition update";
    return 1;
  fi

  # Check if the task definition differs from what's in AWS
  if ! check_task_definition_differs; then
    echo "Skipping ECS task definition registration";
    return 1;
  fi

  echo "Registering updated task definition...";

  # Register the task definition using AWS CLI
  if aws ecs register-task-definition \
    --family ${FAMILY} \
    --cli-input-json file://${TD_FILE}; then
    echo "✓ Task definition registered successfully!";
    return 0;
  else
    echo "✗ Task definition registration failed!";
    exit 1;
  fi
}

#
# Updates the ECS service to use the latest task definition
#
function update_ecs_service() {
  echo "Updating ECS service to use the new task definition...";
  echo "Cluster: ${CLUSTER}";
  echo "Service: ${SERVICE}";
  echo "Family: ${FAMILY}";

  # Update the service to use the latest task definition from the family
  if aws ecs update-service \
    --cluster ${CLUSTER} \
    --service ${SERVICE} \
    --task-definition ${FAMILY} \
    --force-new-deployment; then
    echo "✓ ECS service updated successfully!";
    echo "The service will now use the new task definition";
    return 0;
  else
    echo "✗ Failed to update ECS service";
    exit 1;
  fi
}

#
# Main entry point for ECS task definition update process
# Determines the correct file, registers it if needed, and cleans up old revisions
#
function update_ecs_task_definition_process() {
  determine_task_definition_file;

  # Only run cleanup and service update if we successfully registered a new task definition
  if register_task_definition; then
    cleanup_old_task_definitions;
    update_ecs_service;
  fi
}
