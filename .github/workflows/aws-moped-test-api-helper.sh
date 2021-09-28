#!/usr/bin/env bash

#
# Determine working stage based on branch name
#
export WORKING_STAGE="moped_test";
export BUILD_TYPE="moped_test";
export MOEPD_API_DOCKER_IMAGE="python:3.9-alpine";

echo "BUILD_TYPE: ${BUILD_TYPE}";
echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}";
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}";
echo "PR_NUMBER: '${PR_NUMBER}'";
echo "Docker Image: ${MOEPD_API_DOCKER_IMAGE}";

#
# Deploys all functions in the events directory
#
function deploy_moped_test_api() {
  echo "Updating MOPED API: ${WORKING_STAGE^^} @ ${PWD})";
  cd ./moped-api;
  echo "New current working directory: ${PWD}";

  echo "Downloading Zappa Settings";
  aws secretsmanager get-secret-value \
    --secret-id "${AWS_MOPED_API_ZAPPA_CONFIGURAITON_FILE}" | \
    jq -rc ".SecretString" > zappa_settings.json;

  # Now use the docker image to install the requirements and update the deployment
  echo "Deploying to AWS"
  docker run --rm -v "$(pwd):/app" MOEPD_API_DOCKER_IMAGE \
    echo "Changing Directory to /app" \
    && cd /app \
    && echo "Installing Requirements Including Zappa" \
    && pip install -r "/app/requirements/${WORKING_STAGE}.txt" \
    && echo "Updating stage: ${WORKING_STAGE}" \
    && zappa update $WORKING_STAGE;

  echo "Finished Updating MOPED API: ${WORKING_STAGE^^}";
}
