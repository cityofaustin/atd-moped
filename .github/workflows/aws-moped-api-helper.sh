#!/usr/bin/env bash

case "${BRANCH_NAME}" in
"production")
  export WORKING_STAGE="production"
  ;;
"main")
  export WORKING_STAGE="staging"
  ;;
*)
  export WORKING_STAGE="development"
  ;;
esac

echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}"
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}"

#
# Creates a virtual environment instance and activates it
#
function initialize_virtualenv() {
  echo "Initializing Virtual Env for MOPED API: ${WORKING_STAGE^^} @ ${PWD})";
  virtualenv venv;
  source venv/bin/activate;
}

#
# First, we need to create the python package by installing requirements
#
function install_requirements() {
  echo "Installing requirements..."
  pip install -r "./requirements/${WORKING_STAGE}.txt"
}


#
# Download the Zappa settings from the AWS Secrets Manager
#
function download_zappa_settings() {
  echo "Downloading Zappa Settings";
  aws secretsmanager get-secret-value \
  --secret-id "${AWS_MOPED_API_ZAPPA_CONFIGURAITON_FILE}" | \
  jq -rc ".SecretString" > zappa_settings.json;
}

#
# Performs the update to AWS based on the current working stage
#
function update_lambda_api() {
  echo "Running Zappa -- MOPED API: ${WORKING_STAGE}";
  zappa update $WORKING_STAGE;
}

#
# Deploys all functions in the events directory
#
function deploy_moped_api() {
  echo "Updating MOPED API: ${WORKING_STAGE^^} @ ${PWD})";
  cd ./moped-api;
  echo "New current working directory: ${PWD}";
  initialize_virtualenv;
  install_requirements;
  download_zappa_settings;
  update_lambda_api;

  echo "Finished Updating MOPED API: ${WORKING_STAGE^^}";
}
