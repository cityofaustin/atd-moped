#!/usr/bin/env bash


APPLICATION_NAME="atd-moped-editor-development";
HASURA_REPO_NAME="graphql-engine-heroku";
HASURA_SERVER_ENDPOINT="https://${APPLICATION_NAME}.herokuapp.com"

#
# Heroku Deployment Helper Script
#

function print_header() {
  echo -e "\n-----------------------------------------------------";
  echo "| $1";
  echo "-----------------------------------------------------";
}

function build_editor() {
  cd "./moped-editor";
  print_header "Building the editor";
  npm install && npm run build:development;
  print_header "Clearing Bucket -- Exclude test 'private' files";
  aws s3 rm s3://atd-moped-editor-development --recursive --exclude "private/*" --exclude "moped/private/*";
  print_header "Copying test 'private' files from staging into test";
  aws s3 cp s3://atd-moped-editor-staging/private s3://atd-moped-editor-development/private --recursive --quiet;
  aws s3 cp s3://atd-moped-editor-staging/moped/private s3://atd-moped-editor-development/moped/private --recursive --quiet;
  print_header "Deploying to AWS S3";
  aws s3 cp ./build/ s3://atd-moped-editor-development --recursive;
  print_header "Clearing the CF Cache";
  aws cloudfront create-invalidation --distribution-id E2MEG0I5E6VQWJ --paths "/*";
  echo "Done";
  cd ..;
}


#
# Database Deployment
#

function clone_hasura_repo() {
  git clone https://github.com/hasura/graphql-engine-heroku;
  echo "Patching graphql-engine-heroku/Dockerfile, before:";
  head -1 graphql-engine-heroku/Dockerfile;
  sed -ri "s/(2\...?\...?)/1.3.3/g" graphql-engine-heroku/Dockerfile;
  echo "Patching graphql-engine-heroku/Dockerfile, after:";
  head -1 graphql-engine-heroku/Dockerfile;
}

function heroku_commit_and_push() {
  echo "Working from dir: $(pwd)";
  echo "Removing existing .git file";
  rm -rf .git;
  echo "Reinitializing the git folder";
  git init;
  git config user.email "${ATD_CONTACT_ADDRESS}";
  git config user.name "Transportation Data";
  git add .;
  git commit -m "Deployment Commit";
  git remote add heroku "https://heroku:${HEROKU_API_KEY}@git.heroku.com/atd-moped-editor-development.git"
  git push heroku master;
}


function build_database() {
  print_header "Cleaning up"

  rm -rf "${HASURA_REPO_NAME}" || echo "Nothing to clean";

  print_header "Cloning Hasura Engine";
  clone_hasura_repo;

  cd "${HASURA_REPO_NAME}" || exit 1;

  print_header "Destroying Current Application";
  {
    heroku apps:destroy --app "${APPLICATION_NAME}" --confirm "${APPLICATION_NAME}";
    echo "Done with deletion";
  } || {
    echo "Nothing to destroy."
  }

  print_header "Create new application";
  heroku apps:create "${APPLICATION_NAME}" --team=austin-dts --stack=container;

  print_header "Change application configuration settings";
  heroku config:set --app="${APPLICATION_NAME}"  \
    HASURA_GRAPHQL_DEV_MODE=false \
    HASURA_GRAPHQL_ENABLE_CONSOLE=true \
    HASURA_GRAPHQL_ADMIN_SECRET="${ATD_MOPED_DEVSTAGE_HASURA_GRAPHQL_ADMIN_SECRET}" \
    HASURA_GRAPHQL_JWT_SECRET="${ATD_MOPED_DEVSTAGE_HASURA_GRAPHQL_JWT_SECRET}" \
    MOPED_API_APIKEY="${ATD_MOPED_DEVSTAGE_HASURA_MOPED_API_KEY}" \
    MOPED_API_EVENTS_URL="${ATD_MOPED_DEVSTAGE_HASURA_MOPED_EVENTS_URL}" \
    MOPED_API_ACTIONS_URL="${ATD_MOPED_DEVSTAGE_HASURA_MOPED_ACTIONS_URL}" &> /dev/null;

  echo "Done (muted result)";

  print_header "Create add-ons";
  heroku addons:create heroku-postgresql:hobby-dev -a "${APPLICATION_NAME}";

  print_header "Pushing Changes to Heroku";
  heroku_commit_and_push;

  cd ..;
}

function hasura_server_ready() {
  HASURA_SERVER_STATUS=$(curl --silent $HASURA_SERVER_ENDPOINT/healthz);
  if [[ "${HASURA_SERVER_STATUS}" = "OK" ]]; then
    echo "TRUE"
  else
    echo "FALSE"
  fi
}

function wait_server_ready() {
  INITIALIZATION_TIMEOUT_LIMIT=60
  INITIALIZATION_COUNT=1

  while [ "$(hasura_server_ready)" = "FALSE" ]; do
    echo -ne "Hasura server not ready, please wait. ${INITIALIZATION_COUNT}/${INITIALIZATION_TIMEOUT_LIMIT} 🕔\r";
    if [ $INITIALIZATION_COUNT -gt $INITIALIZATION_TIMEOUT_LIMIT ]; then
      echo "Hasura server unavailable"
      exit 1
    fi
    sleep 1
    INITIALIZATION_COUNT=$(($INITIALIZATION_COUNT + 1))
  done
  echo "[λ] Hasura server ready!                    ✅";
}

function run_database_migration() {
  cd "moped-database";

  print_header "Applying All Migrations";
  echo "From directory: $(pwd)";
  echo "Endpoint: ${HASURA_SERVER_ENDPOINT}";
  sleep 5;

  # For the time being, we need to remove PostGIS from Heroku, it's not helping
  print_header "Removing PostGIS from extensions";
  sed --in-place '/create extension if not exists postgis/d' ./migrations/1599856186244_init/up.sql;
  {
    grep -rIno "create extension if not exists postgis" ./migrations/1599856186244_init/up.sql;
  } || {
    echo "PostGIS removed successfully.";
  }

  print_header "Checking the server is online";
  wait_server_ready;

  print_header "Contents of Configuration";
  cp config/hasura.local.yaml config.yaml;
  cat config.yaml;

  print_header "Apply Migrations";
  hasura migrate apply \
    --admin-secret "${ATD_MOPED_DEVSTAGE_HASURA_GRAPHQL_ADMIN_SECRET}" \
    --endpoint "${HASURA_SERVER_ENDPOINT}";

  print_header "Apply Metadata";
  hasura metadata apply \
    --admin-secret "${ATD_MOPED_DEVSTAGE_HASURA_GRAPHQL_ADMIN_SECRET}" \
    --endpoint "${HASURA_SERVER_ENDPOINT}";

  print_header "Apply Seed data";
  {
    hasura seeds apply \
      --admin-secret "${ATD_MOPED_DEVSTAGE_HASURA_GRAPHQL_ADMIN_SECRET}" \
      --endpoint "${HASURA_SERVER_ENDPOINT}";
  } || {
    echo "Migrations finished!"
  }

  cd ..;
}
