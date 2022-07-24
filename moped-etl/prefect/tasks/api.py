import json
import boto3
import os
import re

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

# set up the prefect logging system
logger = prefect.context.get("logger")

AWS_DEFAULT_REGION = os.environ["AWS_DEFAULT_REGION"]
AWS_STAGING_DYNAMO_DB_TABLE_NAME = os.environ["AWS_STAGING_DYNAMO_DB_TABLE_NAME"]
AWS_STAGING_DYNAMO_DB_ARN = os.environ["AWS_STAGING_DYNAMO_DB_ARN"]
AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME = os.environ[
    "AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME"
]
AWS_STAGING_COGNITO_USER_POOL_ID = os.environ["AWS_STAGING_COGNITO_USER_POOL_ID"]
AWS_STAGING_COGNITO_APP_ID = os.environ["AWS_STAGING_COGNITO_APP_ID"]
AWS_STAGING_COGNITO_USER_POOL_ARN = os.environ["AWS_STAGING_COGNITO_USER_POOL_ARN"]
AWS_COGNITO_DYNAMO_SECRET_KEY = os.environ["AWS_COGNITO_DYNAMO_SECRET_KEY"]

HASURA_HTTPS_ENDPOINT = os.environ["HASURA_HTTPS_ENDPOINT"]
HASURA_ADMIN_SECRET = os.environ["HASURA_ADMIN_SECRET"]

MOPED_API_UPLOADS_S3_BUCKET = os.environ["MOPED_API_UPLOADS_S3_BUCKET"]
MOPED_API_HASURA_SQS_URL = os.environ["MOPED_API_HASURA_SQS_URL"]
MOPED_API_HASURA_APIKEY = os.environ["MOPED_API_HASURA_APIKEY"]

# Create a constistent name for the API config secret for deploy, deploy config, and undeploy
def create_secret_name(basename):
    return f"MOPED_TEST_SYS_API_CONFIG_{basename}"


# The Flask app retrieves these secrets from Secrets Manager
@task(name="Create test API config Secrets Manager entry")
def create_moped_api_secrets_entry(basename):
    logger.info("Creating API secret config")

    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)

    secret_name = create_secret_name(basename)
    secret = {
        "COGNITO_REGION": AWS_DEFAULT_REGION,
        "COGNITO_USERPOOL_ID": AWS_STAGING_COGNITO_USER_POOL_ID,
        "COGNITO_APP_CLIENT_ID": AWS_STAGING_COGNITO_APP_ID,
        "COGNITO_DYNAMO_TABLE_NAME": AWS_STAGING_DYNAMO_DB_TABLE_NAME,
        "COGNITO_DYNAMO_SECRET_KEY": AWS_COGNITO_DYNAMO_SECRET_KEY,
        "HASURA_HTTPS_ENDPOINT": HASURA_HTTPS_ENDPOINT,
        "HASURA_ADMIN_SECRET": HASURA_ADMIN_SECRET,
    }

    response = client.create_secret(
        Name=secret_name,
        Description=f"Moped Test API configuration for {basename}",
        SecretString=json.dumps(secret),
        Tags=[
            {"Key": "project", "Value": "atd-moped"},
            {"Key": "environment", "Value": f"test-{basename}"},
        ],
    )

    secret_arn = response["ARN"]

    return secret_arn


@task(name="Remove test API config Secrets Manager entry")
def remove_moped_api_secrets_entry(basename):
    logger.info("Removing API secret config")

    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)
    secret_name = create_secret_name(basename)

    response = client.delete_secret(
        SecretId=secret_name, ForceDeleteWithoutRecovery=True
    )

    secret_arn = response["ARN"]

    return secret_arn


# Create Zappa deployment configuration to deploy and undeploy Lambda + API Gateway
def create_zappa_config(basename, config_secret_arn):
    zappa_config = {
        f"{basename}": {
            "app_function": "app.app",
            "project_name": "atd-moped-test-prefect",
            "runtime": "python3.8",
            "s3_bucket": "atd-apigateway",
            "cors": True,
            "aws_environment_variables": {
                "MOPED_API_CURRENT_ENVIRONMENT": "TEST",
                "MOPED_API_CONFIGURATION_SETTINGS": create_secret_name(basename),
                "AWS_COGNITO_DYNAMO_TABLE_NAME": AWS_STAGING_DYNAMO_DB_TABLE_NAME,
                "AWS_COGNITO_DYNAMO_SECRET_NAME": AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME,
                # Look at Moped API events.py to see how this key is used
                "MOPED_API_HASURA_APIKEY": MOPED_API_HASURA_APIKEY,
                "MOPED_API_HASURA_SQS_URL": MOPED_API_HASURA_SQS_URL,
                "MOPED_API_UPLOADS_S3_BUCKET": MOPED_API_UPLOADS_S3_BUCKET,
            },
            "extra_permissions": [
                {
                    "Effect": "Allow",
                    "Action": "secretsmanager:GetSecretValue",
                    "Resource": [f"{AWS_STAGING_DYNAMO_DB_ARN}", config_secret_arn],
                },
                {
                    "Effect": "Allow",
                    "Action": "cognito-idp:*",
                    "Resource": f"{AWS_STAGING_COGNITO_USER_POOL_ARN}",
                },
            ],
        }
    }
    return zappa_config


create_api_task = ShellTask(
    name="Run API Zappa deploy bash command", stream_output=True, return_all=True
)


@task(name="Create API Zappa deploy bash command")
def create_moped_api_deploy_command(basename, config_secret_arn):
    logger.info("Creating API Zappa deploy command")

    zappa_config = create_zappa_config(basename, config_secret_arn)
    api_project_path = "../../moped-api/"

    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa deploy requires an active virtual environment
    # then use a subshell to zappa deploy in moped-api project folder
    command = f"""python3 -m venv venv;
    . venv/bin/activate;
    (cd {api_project_path} &&
    pip install wheel &&
    pip install -r ./requirements/moped_test.txt &&
    zappa deploy {basename})
    deactivate;
    """

    return command


# The output list comes from create_api_task's return_all=True
# See https://docs.prefect.io/api/latest/tasks/shell.html#shelltask
@task(name="Get endpoint from Zappa deploy shell task output")
def get_endpoint_from_deploy_output(output_list):
    api_endpoint_item = ""

    for item in output_list:
        if "https://" in item and "amazonaws" in item:
            api_endpoint_item = item

    match = re.search(r"(https://.*)", api_endpoint_item)

    if match == None:
        return None
    else:
        endpoint = match.groups()[0]
        return endpoint


remove_api_task = ShellTask(
    name="Run API Zappa undeploy bash command", stream_output=True
)


@task(name="Create API Zappa undeploy bash command")
def create_moped_api_undeploy_command(basename, config_secret_arn):
    logger.info("Creating API Zappa undeploy bash command")

    zappa_config = create_zappa_config(basename, config_secret_arn)
    api_project_path = "../../moped-api/"

    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa undeploy with auto-confirm delete flag
    command = f"(cd {api_project_path} && zappa undeploy {basename} --yes)"

    return command
