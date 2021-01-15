ATD_SCHEMASPY_CONTAINER_NAME="atd-moped-schemaspy:local";

#
# Check if docker is running
#
function __get_docker_running() {
  {
    docker ps -q &> /dev/null && echo "TRUE";
  } || {
    echo "FALSE";
  }
}

#
# Gets the current hasura cluster status
#
function __get_status() {
  echo $(curl --silent "http://localhost:8080/healthz");
}

#
# Gets the current hasura cluster version
#
function __get_version() {
  echo $(curl --silent "http://localhost:8080/v1/version");
}

echo "Generating documentation, one moment while checking on server status";

VERSION=$(__get_version);
STATUS=$(__get_status);
MESSAGE=""
if [[ "${STATUS}" == "OK" ]]; then
  EMOJI="✅";
  MESSAGE="Hasura cluster available, proceeding with documentation process!"
else
  STATUS=" Unreachable"
  VERSION="?"
  EMOJI="⚠️";
  MESSAGE="Try './hasura-cluster start' or 'docker ps -a' to check..."
fi;

echo -e "\n--------------------------------------------------------------------";
echo " ⛅️  Hasura Server Status";
echo "--------------------------------------------------------------------";
echo " Status: ${EMOJI} ${STATUS}";
echo " Version: ${VERSION}";
echo " ${MESSAGE}";
echo -e "--------------------------------------------------------------------\n";


if [[ "${STATUS}" != "OK" ]]; then
  echo "Hasura cluster not available, stopping documentation process.";
  exit 1;
fi;

echo "Gathering docker requirements...";
docker build -f Dockerfile . -t $ATD_SCHEMASPY_CONTAINER_NAME;

echo -e "\n\nGenerating documentation...";
mkdir output;
docker run -it --rm -v "$(pwd)"/output:/output --network="host" $ATD_SCHEMASPY_CONTAINER_NAME;

echo "Copying to S3";
aws s3 cp --recursive output/ s3://db-docs.austinmobility.io;

echo -e "\n\nFinished generating documentation. You may visit http://db-docs.austinmobility.io/";
rm -rf output;
