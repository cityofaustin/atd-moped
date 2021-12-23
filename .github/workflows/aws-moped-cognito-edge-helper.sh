#!/usr/bin/env bash

set -o errexit;

case "${BRANCH_NAME}" in
  "production")
    export WORKING_STAGE="production";
  ;;
  "main")
    export WORKING_STAGE="staging";
  ;;
  *)
    export WORKING_STAGE="production";
  ;;
esac;

CLOUDFRONT_COGNITO_EDGE_DIR="$(pwd)/moped-auth/cloudfront-cognito-at-edge";

# Check if our directory exists, if not then we can exit
if [[ ! -d "${CLOUDFRONT_COGNITO_EDGE_DIR}" ]]; then
  echo "Required build directory '${CLOUDFRONT_COGNITO_EDGE_DIR}' does not exist, aborting.";
  exit 0;
fi;

#
# If IGNORE_BRANCH is set to TRUE, skip branch check...
#
if [[ "${IGNORE_BRANCH}" == "TRUE" ]]; then
  echo "Ignoring branch build, assuming ${WORKING_STAGE} environment";
else
  if [[ "${WORKING_STAGE}" == "test" ]]; then
    echo "Builds are only supported for production or staging at this moment";
    exit 0;
  else
      echo "Preparing Build & Deployment for environment: ${WORKING_STAGE}";
  fi;
fi;

#
# Builds the bundle into a zip file.
#
function build() {
  echo "Building Node Module...";
  # Copy working stage into index.js
  cp "${CLOUDFRONT_COGNITO_EDGE_DIR}/${WORKING_STAGE}.js" "${CLOUDFRONT_COGNITO_EDGE_DIR}/index.js";

  # At the time of this writing, Lambda@Edge only supports node v14.x.x
  docker run --tty --rm --workdir="/app" \
     --volume "${CLOUDFRONT_COGNITO_EDGE_DIR}:/app" node:14-alpine \
     sh -c "apk update && apk add zip && npm install && zip -r9 -r function.zip node_modules index.js package.json package-lock.json";
}

#
# Updates lambda@edge function
#
function deploy() {
  FUNCTION_NAME="atd-moped-cloudfront-auth-${WORKING_STAGE}";
  echo "Deploying function: ${FUNCTION_NAME}";
  aws lambda update-function-code \
    --function-name "${FUNCTION_NAME}" \
    --zip-file "fileb://${CLOUDFRONT_COGNITO_EDGE_DIR}/function.zip" > /dev/null;
}
