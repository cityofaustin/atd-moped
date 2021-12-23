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
  exit 1;
else
  cleanup;
  cp "${WORKING_STAGE}.js" index.js;
fi;


echo "Building Node Module...";
{
 docker run -it --rm --workdir="/app" \
     --volume "$(pwd):/app" node:14-alpine \
     sh -c "apk update && apk add zip && npm install && zip -r9 -r function.zip node_modules index.js package.json package-lock.json";
} || {
  echo "There was a problem when building"
}

function cleanup() {
  echo "Cleaning up...";
  rm index.js || echo "Skipping index.js clean-up";
  rm function.zip || echo "Skipping function.zip clean-up";
  rm -rf node_modules || echo "Skipping node_modules cleanup";
}

function deploy() {
  FUNCTION_NAME="atd-moped-cloudfront-auth-${WORKING_STAGE}";
  echo "Deploying function: ${FUNCTION_NAME}";
  aws lambda update-function-code \
    --function-name "${FUNCTION_NAME}" \
    --zip-file fileb://$PWD/function.zip > /dev/null;
}

function build() {
  echo "Building Node Module...";
  docker run -it --rm --workdir="/app" \
     --volume "$(pwd):/app" node:14-alpine \
     sh -c "apk update && apk add zip && npm install && zip -r9 -r function.zip node_modules index.js package.json package-lock.json";
}


