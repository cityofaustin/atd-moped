#
# Heroku Deployment Helper Script
#

function print_header() {
  echo "$1";
  echo "-------------------------------------------";
}

function build_editor() {
  cd "./moped-editor";
  print_header "Building the editor";
  npm build local:development;
  print_header "Deploying to AWS S3";
  # aws s3 cp ./build/* s3://the-s3-bucket --recursive;
  print_header "Clearing the CF Cache";
  echo "Done";
  cd ..;
}


#
# Database Deployment
#

function clone_hasura_repo() {
  git clone https://github.com/hasura/graphql-engine-heroku;
}

function build_database() {
    echo "Delete the current application";
    echo "Create new application";
    echo "Create add-ons";
    echo "Apply Migrations";
    echo "Apply Metadata";
    echo "Apply Seed data";
}