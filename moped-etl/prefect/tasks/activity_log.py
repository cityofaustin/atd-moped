import os
import boto3

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

# set up the prefect logging system
logger = prefect.context.get("logger")

HASURA_ADMIN_SECRET = os.environ["HASURA_ADMIN_SECRET"]

# SQS deployment needs:
# Comes from deploy_event_function
# FUNCTION_NAME = "atd-moped-events-"
# Comes from
# activity_log

# ShellScript command
# Use helper functions individually for tasks
# source $(pwd)/.github/workflows/aws-moped-sqs-helper.sh

# Call:
# 1. install_requirements
# 2. bundle_function
# 3. generate_env_vars - rework this?
# 4. deploy_lambda_function
# 5. deploy_sqs which calls deploy_event_source_mapping

# Return SQS endpoint


# This is the config and env vars for the Lambda (atd-moped-events-activity_log_test)
lambda_config = {
    "Description": "AWS Moped Data Event: atd-moped-events-activity_log_moped-test - TEST",
    "Environment": {
        "Variables": {
            # this comes from another flow
            "HASURA_ENDPOINT": "",
            "HASURA_ADMIN_SECRET": "",
            "API_ENVIRONMENT": "TEST",
            "COGNITO_DYNAMO_TABLE_NAME": "atd-moped-users-staging",
        }
    },
}

create_activity_log_task = ShellTask(
    name="Run Activity Log helper bash script", stream_output=True, return_all=True
)


@task
def create_activity_log_command(basename):
    helper_script_path = "../../.github/workflows"

    command = f"""python3 -m virtualenv venv;
    source venv/bin/activate;
    (cd {helper_script_path} &&
    ls)
    """
    # pip install wheel &&
    # pip install -r ./requirements/moped_test.txt &&
    # zappa deploy {basename})
    # deactivate;
    # """

    return command


@task
def remove_activity_log_sqs():
    # Use boto3 to remove SQS
    logger.info("removing activity log SQS")
    return True


@task
def remove_activity_log_lambda():
    # Use boto3 to remove activity log event lambda
    logger.info("removing activity log Lambda")
    return True
