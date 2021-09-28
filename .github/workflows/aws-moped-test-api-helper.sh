#!/usr/bin/env bash

#set -o errexit;

#
# Determine working stage based on branch name
#
export WORKING_STAGE="moped_test";
export BUILD_TYPE="moped_test";
export MOEPD_API_DOCKER_IMAGE="python:3.8-alpine";

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

  # Now use the docker image to install the requirements and update the deployment
  echo "Deploying to AWS"
  docker run --rm -v "$(pwd):/app" \
    --env AWS_DEFAULT_REGION --env AWS_ACCESS_KEY_ID --env AWS_SECRET_ACCESS_KEY \
    $MOEPD_API_DOCKER_IMAGE sh -c "\
    echo \"Changing Directory to /app\" \
    && cd /app \
    && apk add --no-cache pkgconfig gcc libcurl python3-dev gpgme-dev libc-dev \
    && echo \"Installing Requirements Including Zappa\" \
    && pip install -r \"/app/requirements/${WORKING_STAGE}.txt\" \
    && echo \"Updating stage: ${WORKING_STAGE}\" \
    && zappa update ${WORKING_STAGE}";

  echo "Finished Updating MOPED API: ${WORKING_STAGE^^}";
}
