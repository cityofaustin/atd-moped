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
    export WORKING_STAGE="other";
  ;;
esac;

echo "Preparing Build & Deployment";
if [[ "${WORKING_STAGE}" == "other" ]]; then
  echo "Builds are only supported for production or staging at this moment";
  exit 0;
fi;

function deploy() {
  FUNCTION_NAME="atd-moped-cloudfront-auth-${WORKING_STAGE}";
  echo "Deploying function: ${FUNCTION_NAME}";
  aws lambda update-function-code \
    --function-name "${FUNCTION_NAME}" \
    --zip-file fileb://$PWD/function.zip > /dev/null;
}
