#!/usr/bin/env bash

set -o errexit

ATD_SCHEMASPY_CONTAINER_NAME="atd-moped-schemaspy:local"

case "${BRANCH_NAME}" in
"production")
  export WORKING_STAGE="production"
  ;;
*)
  export WORKING_STAGE="staging"
  ;;
esac

#
# Check if docker is running
#
function __get_docker_running() {
  {
    docker ps -q &>/dev/null && echo "TRUE"
  } || {
    echo "FALSE"
  }
}

#
# Gets the current hasura cluster status
#
function __get_status() {
  echo $(curl --silent "http://localhost:8080/healthz")
}

#
# Gets the current hasura cluster version
#
function __get_version() {
  echo $(curl --silent "http://localhost:8080/v1/version")
}

echo "Generating documentation, one moment while checking on server status"

VERSION=$(__get_version)
STATUS=$(__get_status)
MESSAGE=""
if [[ "${STATUS}" == "OK" ]]; then
  EMOJI="✅"
  MESSAGE="Hasura cluster available, proceeding with documentation process!"
else
  STATUS=" Unreachable"
  VERSION="?"
  EMOJI="⚠️"
  MESSAGE="Try './hasura-cluster start' or 'docker ps -a' to check..."
fi

echo -e "\n--------------------------------------------------------------------"
echo " ⛅️  Hasura Server Status"
echo "--------------------------------------------------------------------"
echo " Status: ${EMOJI} ${STATUS}"
echo " Version: ${VERSION}"
echo " ${MESSAGE}"
echo -e "--------------------------------------------------------------------\n"

if [[ "${STATUS}" != "OK" ]]; then
  echo "Hasura cluster not available, stopping documentation process."
  exit 1
fi

echo "Gathering docker requirements..."
docker build -f Dockerfile . -t $ATD_SCHEMASPY_CONTAINER_NAME

echo -e "\n\nGenerating documentation..."
mkdir output
docker run --tty --rm -v "$(pwd)"/output:/output --network="host" $ATD_SCHEMASPY_CONTAINER_NAME

echo -e "\n\nFinished generating documentation"
ls -lha ./output

echo "Copying Documentation to S3"
aws s3 sync output/ s3://db-docs.austinmobility.io/atd-moped-$WORKING_STAGE

echo "Generate Primary Key Map"
mkdir maps
./generate-pk-map.py > maps/atd-moped-pk-map-$WORKING_STAGE.json


echo "Done Generating Map, copying to S3"
ls -lha ./maps
aws s3 cp maps/atd-moped-pk-map-$WORKING_STAGE.json  s3://db-docs.austinmobility.io/maps/atd-moped-pk-map-$WORKING_STAGE.json

echo "Clear Cache"
aws cloudfront create-invalidation \
  --distribution-id E1QMRCYLR76UOL \
  --paths "/atd-moped-${WORKING_STAGE}/*"

echo "Process Finished"
