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

function build_database() {
    echo "Delete the current application";
    echo "Create new application";
    echo "Create add-ons";
    echo "Apply Migrations";
    echo "Apply Metadata";
    echo "Apply Seed data";
}