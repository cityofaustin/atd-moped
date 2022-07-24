import os
import json
import boto3

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

# set up the prefect logging system
logger = prefect.context.get("logger")

HASURA_ADMIN_SECRET = os.environ["HASURA_ADMIN_SECRET"]
MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN = os.environ["MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN"]
MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX = os.environ["MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX"]

# The folder name of the event function and used in naming the AWS function
function_name = "activity_log"


def create_activity_log_aws_name(basename):
    return f"atd-moped-events-{function_name}_{basename}"


def create_activity_log_queue_url(basename):
    aws_queue_name = create_activity_log_aws_name(basename)
    return f"${MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX}/{aws_queue_name}"


def create_activity_log_lambda_config(
    basename,
):
    return {
        "Description": f"AWS Moped Data Event: atd-moped-events-activity_log_{basename}",
        "Environment": {
            "Variables": {
                # We could probably create a helper so this and the ECS Route53 CNAME always match
                "HASURA_ENDPOINT": f"https://{basename}-graphql.moped-test.austinmobility.io",
                "HASURA_ADMIN_SECRET": HASURA_ADMIN_SECRET,
                "API_ENVIRONMENT": "TEST",
                "COGNITO_DYNAMO_TABLE_NAME": "atd-moped-users-staging",
            }
        },
    }


create_activity_log_task = ShellTask(
    name="Run Activity Log helper bash script", stream_output=True, return_all=True
)


@task(name="Create Activity Log deploy helper command")
def create_activity_log_command(basename):
    logger.info("Creating Activity Log deploy helper command")

    aws_function_name = create_activity_log_aws_name(basename)

    helper_script_path = "../../.github/workflows"
    deployment_path = f"../../moped-data-events/{function_name}"

    lambda_config = create_activity_log_lambda_config(basename)

    # Write Lambda config to activity_log project folder
    with open(f"{deployment_path}/handler_config.json", "w") as f:
        json.dump(lambda_config, f)

    # This command outputs
    command = f"""python3 -m virtualenv venv;
    source venv/bin/activate;
    (cd {helper_script_path} &&
    pip install awscli &&
    source aws-moped-sqs-helper.sh &&
    deploy_moped_test_event_function {function_name} {aws_function_name} {MOPED_ACTIVITY_LOG_LAMBDA_ROLE_ARN})
    deactivate;
    """

    return command


@task
def remove_activity_log_sqs(basename):
    logger.info("Removing Activity Log SQS")

    sqs_client = boto3.client("sqs")

    queue_url = create_activity_log_queue_url(basename)
    response = sqs_client.delete_queue(QueueUrl=queue_url)
    print(response)
    return response


@task
def remove_activity_log_lambda(basename):
    logger.info("Removing Activity Log Lambda function")

    lambda_client = boto3.client("lambda")

    function_name = create_activity_log_aws_name(basename)
    response = lambda_client.delete_function(FunctionName=function_name)

    return response
