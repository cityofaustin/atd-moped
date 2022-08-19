import os
import json
import boto3

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

import tasks.shared as shared

# set up the prefect logging system
logger = prefect.context.get("logger")

MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN = os.environ["MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN"]
MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX = os.environ["MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX"]
SHA_SALT = os.environ["SHA_SALT"]

# The folder name of the event function and used in naming the AWS function
FUNCTION_NAME = "activity_log"
IAM_ROLE_FOR_ACTIVITY_LOG_LAMBDA = os.environ["IAM_ROLE_FOR_ACTIVITY_LOG_LAMBDA"] 


def create_activity_log_lambda_config(graphql_engine_api_key, slug):
    graphql_endpoint = shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
    activity_log_endpoint = slug["activity_log_slug"]
    return {
        "Description": f"AWS Moped Data Event: atd-moped-events-activity_log_{activity_log_endpoint}",
        "Environment": {
            "Variables": {
                # We could probably create a helper so this and the ECS Route53 CNAME always match
                "HASURA_ENDPOINT": graphql_endpoint,
                "HASURA_ADMIN_SECRET": graphql_engine_api_key,
                "API_ENVIRONMENT": "TEST",
                "COGNITO_DYNAMO_TABLE_NAME": "atd-moped-users-staging",
            }
        },
    }


create_activity_log_task = ShellTask(
    name="Run Activity Log helper bash script", stream_output=True, return_all=True
)


@task(name="Create Activity Log deploy helper command")
def create_activity_log_command(slug):
    logger.info("Creating Activity Log deploy helper command")

    aws_function_name = shared.create_activity_log_aws_name(slug["activity_log_slug"], FUNCTION_NAME)

    helper_script_path = "/tmp/atd-moped/.github/workflows"
    deployment_path = f"/tmp/atd-moped/moped-data-events/{FUNCTION_NAME}"

    graphql_engine_api_key = shared.generate_access_key(slug["basename"])

    lambda_config = create_activity_log_lambda_config(graphql_engine_api_key=graphql_engine_api_key, slug=slug)

    # Write Lambda config to activity_log project folder
    with open(f"{deployment_path}/handler_config.json", "w") as f:
        json.dump(lambda_config, f)

    # This command outputs
    command = f"""python3 -m virtualenv venv;
    source venv/bin/activate;
    (cd {helper_script_path} &&
    pip install awscli &&
    source aws-moped-sqs-helper.sh &&
    deploy_moped_test_event_function {FUNCTION_NAME} {aws_function_name} {MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN})
    deactivate;
    """

    return command


@task
def remove_activity_log_sqs(slug):
    basename = slug["basename"]
    logger.info("Removing Activity Log SQS")

    sqs_client = boto3.client("sqs")

    queue_url = shared.create_activity_log_queue_url(basename)
    response = sqs_client.delete_queue(QueueUrl=queue_url)
    print(response)
    return response


@task
def remove_activity_log_lambda(slug):
    basename = slug["basename"]
    logger.info("Removing Activity Log Lambda function")

    lambda_client = boto3.client("lambda")

    activity_log_function_name = shared.create_activity_log_aws_name(basename, FUNCTION_NAME)
    response = lambda_client.delete_function(FunctionName=activity_log_function_name)

    return response
