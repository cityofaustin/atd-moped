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

PYTHON_REQUIREMENTS_FILE="$(pwd)/moped-auth/cognito-pre-token-hook/requirements/${WORKING_STAGE}.txt"

#
# First, we need to create the python package by installing requirements
#
function install_requirements() {
  echo "Updating PIP"
  pip install --upgrade pip
  echo "Installing AWS's CLI"
  pip install awscli
  echo "Installing requirements from ${PYTHON_REQUIREMENTS_FILE}..."
  pip install -r "${PYTHON_REQUIREMENTS_FILE}" --platform manylinux2014_x86_64 --only-binary=:all: --target ./package
}

#
# Secondly, we must bundle the package and python script into a single zip file bundle
#
function bundle_function() {
  echo "Bundling function..."
  cd package
  zip -r9 ../function.zip .
  cd ${OLDPWD}
  zip -g function.zip handler.py
}

#
# Retrieves the environment variables JSON stored in AWS
#
function generate_environment() {
  aws secretsmanager get-secret-value \
    --secret-id "ATD_MOPED_COGNITO_HOOK_ENV_${WORKING_STAGE^^}" |
    jq -rc ".SecretString" >handler_config.json
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
  echo "Resetting environment variables: ${FUNCTION_NAME} @ ${PWD}"
  aws lambda update-function-configuration \
    --function-name "${FUNCTION_NAME}" \
    --cli-input-json file://$PWD/handler_config.json | jq -r ".LastModified"
  echo "Finished Lambda Update/Deployment"
}

#
# Deploys all cognito functions
#
function deploy_cognito_functions() {
  MAIN_DIR=$PWD
  FUNCTION="moped-auth/cognito-pre-token-hook"
  FUNCTION_DIR=$(echo "${FUNCTION}" | cut -d "/" -f 2)
  FUNCTION_NAME="atd-moped-${FUNCTION_DIR}-${WORKING_STAGE}"
  echo "Current directory: ${PWD}"
  echo "Building function '${FUNCTION_NAME}' @ path: '${FUNCTION}'"
  cd $FUNCTION
  echo "Entered directory: ${PWD}"
  install_requirements
  bundle_function
  generate_environment "$FUNCTION_NAME"
  deploy_cognito_function "$FUNCTION_NAME"
  cd $MAIN_DIR
  echo "Exit, current path: ${PWD}"
}
