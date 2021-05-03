#
# Heroku Deployment Helper Script
#

function build_editor() {
  echo "Built the editor!";
  echo "Deploying to AWS S3";
  echo "Clearing the CF Cache";
  echo "Done";
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