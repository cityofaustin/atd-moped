#!/usr/bin/env bash

set -o errexit;

#
# Heroku Deployment Helper Script
#

function print_header() {
  echo "$1";
  echo "-----------------------------------------------------";
}

function build_editor() {
  cd "./moped-editor";
  print_header "Building the editor";
  npm install && npm run build:development;
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
}

function heroku_commit_and_push() {
  echo "Working from dir: $(pwd)";
  git init && git add .
  git commit -m "Deployment Commit"
  git remote add heroku "https://git.heroku.com/atd-moped-editor-development.git"
  git push heroku master
}

function build_database() {
  APPLICATION_NAME="atd-moped-editor-development"
  print_header "Cloning Hasura Engine";
  clone_hasura_repo;

  print_header "Destroying Current Application";
  {
    heroku apps:destroy --app "${APPLICATION_NAME}" --confirm "${APPLICATION_NAME}"
  } || {
    echo "Nothing to destroy."
  }

  print_header "Create new application";
  heroku apps:create "${APPLICATION_NAME}" --team=austin-dts --stack=container;

  print_header "Change application configuration settings";
  heroku config:set --app="${APPLICATION_NAME}" ADMIN_SECRET=8N029N81 DISABLE_SUCH_AND_SUCH=9s83109d3+583493190

  print_header "Create add-ons";
  heroku addons:create heroku-postgresql:hobby-dev -a "${APPLICATION_NAME}";

  print_header "Pushing Changes to Heroku";
  heroku_commit_and_push;

  cd ..;
}

function run_database_migration() {
  print_header "Applying All Migrations";
  print_header "Apply Migrations";
  print_header "Apply Metadata";
  print_header "Apply Seed data";
}