import os

import prefect
from prefect import task

# set up the prefect logging system
logger = prefect.context.get("logger")

# SQS deployment needs:
sqs_config = {
    "Description": "AWS Moped Data Event: %FUNCTION_NAME% - TEST",
    "Environment": {
        "Variables": {
            "HASURA_ENDPOINT": "https://atd-moped-editor-development.herokuapp.com/v1/graphql",
            "HASURA_ADMIN_SECRET": "n@kUHnB6OG6Nu1469uqob6v45jnVrWP4G9LCflf427y2w4HzLOwoOv7dVybUU6!d",
            "API_ENVIRONMENT": "TEST",
            "COGNITO_DYNAMO_TABLE_NAME": "atd-moped-users-staging",
        }
    },
}


@task
def create_activity_log_sqs():
    # Use boto3 to create SQS
    logger.info("creating activity log SQS")
    return True


@task
def create_activity_log_lambda():
    # Use boto3 to create activity log event lambda
    logger.info("creating activity log Lambda")
    return True


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
