#!/usr/bin/env bash

case "${BRANCH_NAME}" in
"production")
  export WORKING_STAGE="production";
  ;;
*)
  export WORKING_STAGE="staging";
  ;;
esac

echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}";
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}";

#
# First, we need to create the python package by installing requirements
#
function install_requirements() {
  echo "Installing AWS's CLI";
  pip install awscli;
  echo "Installing requirements...";
  pip install -r "./requirements/${WORKING_STAGE}.txt" --target ./package;
}

#
# Secondly, we must bundle the package and python script into a single zip file bundle
#
function bundle_function() {
  echo "Bundling function...";
  cd package;
  zip -r9 ../function.zip .;
  cd ${OLDPWD};
  zip -g function.zip *.py;
}

#
# Retrieves the environment variables JSON stored in AWS
#
function generate_environment() {
  # If the config settings is not provided, then assume cognito pattern...
  if [[ "${1}" = "" ]]; then
    echo "No configuration name detected, aborting.";
    exit 1;
  else
    CONFIGURATION_NAME=$1;
  fi;

  aws secretsmanager get-secret-value \
  --secret-id "${CONFIGURATION_NAME}_${WORKING_STAGE^^}" | \
  jq -rc ".SecretString" > handler_config.json;
}

#
# Deploys a single function
#
function deploy_cognito_function() {
  FUNCTION_NAME=$1
  echo "Deploying function: ${FUNCTION_NAME} @ ${PWD}"
  # Create or update function
  { # try
    echo "Creating lambda function ${FUNCTION_NAME} @ ${PWD}"
    aws lambda create-function \
      --role "${ATD_MOPED_COGNITO_ROLE}" \
      --handler "handler.handler" \
      --tags "project=atd-moped,environment=${WORKING_STAGE}" \
      --runtime python3.8 \
      --function-name "${FUNCTION_NAME}" \
      --zip-file fileb://$PWD/function.zip >/dev/null
  } || { # catch: update
    echo -e "\n\nUpdating lambda function ${FUNCTION_NAME} @ ${PWD}"
    aws lambda update-function-code \
      --function-name "${FUNCTION_NAME}" \
      --zip-file fileb://$PWD/function.zip >/dev/null
  }
  echo "Resetting environment variables: ${FUNCTION_NAME} @ ${PWD}";
  aws lambda update-function-configuration \
        --role "${ATD_MOPED_COGNITO_ROLE}" \
        --function-name "${FUNCTION_NAME}" \
        --cli-input-json file://$PWD/handler_config.json | jq -r ".LastModified";
  echo "Finished Lambda Update/Deployment"
}

#
# Deploys all functions in the events directory
#
function deploy_cognito_functions() {
  FUNCTION=$1;

  if [[ "${FUNCTION}" == "" ]]; then
    echo "No function name specified, aborting.";
    exit 1;
  fi;

  FUNCTION_NAME="atd-moped-${FUNCTION}-${WORKING_STAGE}";
  echo "Current directory: ${PWD}";
  echo "Building function '${FUNCTION_NAME}' @ path: '${FUNCTION}'";
  cd $FUNCTION;
  echo "Entered directory: ${PWD}";
  install_requirements;
  bundle_function;
  generate_environment "$ATD_CONFIGURATION_SETTINGS";
  deploy_cognito_function "$FUNCTION_NAME";
}
