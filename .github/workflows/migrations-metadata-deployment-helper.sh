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
  else
    export ENVIRONMENT="staging"
    export TD_FILE="moped-database/ecs_task_definitions/staging.graphql-engine.ecs-td.json"
  fi

  echo "Environment: ${ENVIRONMENT}";
  echo "Task definition file: ${TD_FILE}";
}

#
# Validates the ECS task definition JSON file using AWS CLI
# Returns 0 if valid, exits with error if invalid or file not found
#
function validate_task_definition() {
  # Check if task definition file exists
  if [ ! -f "${TD_FILE}" ]; then
    echo "Task definition file not found: ${TD_FILE}";
    echo "Skipping ECS task definition update";
    exit 0;
  fi

  echo "Task definition file found, validating...";

  # Validate the task definition using AWS CLI
  # This will check if the JSON is valid and compatible with ECS
  # The --dry-run flag ensures we don't actually register the task definition
  if aws ecs register-task-definition \
    --cli-input-json file://${TD_FILE} \
    --dry-run; then
    echo "✓ Task definition is valid!";
    return 0;
  else
    echo "✗ Task definition validation failed!";
    exit 1;
  fi
}

#
# Main entry point for ECS task definition update process
# Determines the correct file and validates it
#
function update_ecs_task_definition_process() {
  determine_task_definition_file;
  validate_task_definition;
}
