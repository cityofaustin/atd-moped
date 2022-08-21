import json
import time
import boto3
import os
import shutil
import re
from datetime import timedelta

import tasks.ecs as ecs

import pprint
import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

import tasks.shared as shared

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


MOPED_API_UPLOADS_S3_BUCKET = os.environ["MOPED_API_UPLOADS_S3_BUCKET"]
MOPED_API_HASURA_SQS_URL = os.environ["MOPED_API_HASURA_SQS_URL"]

SHA_SALT = os.environ["SHA_SALT"]

ACTIVITY_LOG_FUNCTION_NAME = os.environ["ACTIVITY_LOG_FUNCTION_NAME"]

ZAPPA_PROJECT_NAME = os.environ["ZAPPA_PROJECT_NAME"]

IAM_ROLE_FOR_API_LAMBDA = os.environ["IAM_ROLE_FOR_API_LAMBDA"]

# Create a consistent name for the API config secret for deploy, deploy config, and undeploy
def create_secret_name(basename):
    return f"MOPED_TEST_SYS_API_CONFIG_{basename}"


@task(name="Check if secret exists")
def check_secret_exists(slug):
    basename = slug["awslambda"]

    secret_name = create_secret_name(basename)

    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)
    try:
        client.get_secret_value(SecretId=secret_name)
        logger.info(f"Secret {secret_name} already exists")
        return True
    except client.exceptions.ResourceNotFoundException:
        logger.info(f"Secret {secret_name} does not exist")
        return False


# The Flask app retrieves these secrets from Secrets Manager
@task(
    name="Create test API config Secrets Manager entry",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def create_moped_api_secrets_entry(slug, ready_for_secret):
    basename = slug["awslambda"]

    logger.info("Creating API secret config")

    graphql_endpoint = shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
    graphql_engine_api_key = shared.generate_access_key(slug["basename"])

    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)

    secret_name = create_secret_name(basename)
    secret = {
        "COGNITO_REGION": AWS_DEFAULT_REGION,
        "COGNITO_USERPOOL_ID": AWS_STAGING_COGNITO_USER_POOL_ID,
        "COGNITO_APP_CLIENT_ID": AWS_STAGING_COGNITO_APP_ID,
        "COGNITO_DYNAMO_TABLE_NAME": AWS_STAGING_DYNAMO_DB_TABLE_NAME,
        "COGNITO_DYNAMO_SECRET_KEY": AWS_COGNITO_DYNAMO_SECRET_KEY,
        "HASURA_HTTPS_ENDPOINT": "https://" + graphql_endpoint,
        "HASURA_ADMIN_SECRET": graphql_engine_api_key,
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

    logger.info("Response ARN: " + secret_arn)

    return secret_arn


@task(name="Remove test API config Secrets Manager entry")
def remove_moped_api_secrets_entry(slug):
    basename = slug["awslambda"]
    logger.info("Removing API secret config")

    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)
    secret_name = create_secret_name(basename)

    response = client.delete_secret(
        SecretId=secret_name, ForceDeleteWithoutRecovery=True
    )

    sleep = 30
    logger.info(f"Sleeping {sleep} seconds to allow secret to be deleted")
    time.sleep(sleep)

    secret_arn = response["ARN"]

    return secret_arn


# Create Zappa deployment configuration to deploy and undeploy Lambda + API Gateway
def create_zappa_config(basename, config_secret_arn):
    zappa_config = {
        f"{basename}": {
            "app_function": "app.app",
            "project_name": ZAPPA_PROJECT_NAME,
            "runtime": "python3.8",
            "s3_bucket": "atd-apigateway",
            "cors": True,
            "aws_environment_variables": {
                "MOPED_API_CURRENT_ENVIRONMENT": "TEST",
                "MOPED_API_CONFIGURATION_SETTINGS": create_secret_name(basename),
                "AWS_COGNITO_DYNAMO_TABLE_NAME": AWS_STAGING_DYNAMO_DB_TABLE_NAME,
                "AWS_COGNITO_DYNAMO_SECRET_NAME": AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME,
                # Look at Moped API events.py to see how this key is used
                "MOPED_API_HASURA_APIKEY": shared.generate_api_key(basename),
                "MOPED_API_HASURA_SQS_URL": shared.create_activity_log_queue_url(
                    basename, ACTIVITY_LOG_FUNCTION_NAME
                ),
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
def create_moped_api_deploy_command(slug, config_secret_arn, ready_for_api_deployment):
    basename = slug["awslambda"]

    logger.info("Creating API Zappa deploy command")

    zappa_config = create_zappa_config(basename, config_secret_arn)

    api_project_path = "/tmp/atd-moped/moped-api"

    logger.info(f"Writing Settings in {api_project_path}")
    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}/zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa deploy requires an active virtual environment
    # then use a subshell to zappa deploy in moped-api project folder
    command = f"""python3 -m virtualenv venv;
    source venv/bin/activate;
    (cd {api_project_path} &&
    pip install wheel &&
    pip install -r ./requirements/moped_test.txt &&
    zappa deploy {basename})
    deactivate;
    """

    # print("API Deployment command:\n" + command + "\n")

    return command


# The output list comes from create_api_task's return_all=True
# See https://docs.prefect.io/api/latest/tasks/shell.html#shelltask
@task(name="Get endpoint from Zappa deploy shell task output")
def get_endpoint_from_deploy_output(output_list):

    logger.info("Output List:" + str(output_list))

    failed_signature_match = re.search(
        r"This application is already deployed", str(output_list)
    )
    if not failed_signature_match == None:
        logger.info("output_list indicates that the application is already deployed.")
        raise Exception(
            "output_list indicates that the application is already deployed."
        )

    api_endpoint_item = ""

    for item in output_list:
        if "https://" in item and "amazonaws" in item:
            api_endpoint_item = item

    match = re.search(r"(https://.*)", api_endpoint_item)

    if match == None:
        logger.info("No match found looking for API endpoint URL")
        raise Exception("No match found looking for API endpoint URL")
    else:
        endpoint = match.groups()[0]
        logger.info("Got an API endpoint: " + endpoint)
        return endpoint


remove_api_task = ShellTask(
    name="Run API Zappa undeploy bash command", stream_output=True
)


@task(name="Create API Zappa undeploy bash command")
def create_moped_api_undeploy_command(slug, config_secret_arn):
    basename = slug["awslambda"]
    logger.info("Creating API Zappa undeploy bash command")

    zappa_config = create_zappa_config(basename, config_secret_arn)

    api_project_path = "/tmp/atd-moped/moped-api"

    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}/zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa undeploy with auto-confirm delete flag
    command = f"(cd {api_project_path} && zappa undeploy {basename} --yes)"

    return command


@task(name="Check if API is deployed")
def check_if_api_is_deployed(slug):

    logger.info("Checking if lambda function exists")

    function_name = shared.generate_api_lambda_function_name(slug["awslambda"])

    logger.info("Checking: " + function_name)

    # this is what you get for using lambda as a keyword python...
    λ = boto3.client("lambda")

    try:
        response = λ.get_function(FunctionName=function_name)
    except Exception:
        logger.info(f"Lambda function ({function_name}) does not exist")
        return False

    logger.info("Lambda function exists")
    logger.info(response)
    return True

    # TODO FIXME


# (cd /tmp/atd-moped/moped-api; python3 -m venv ./venv;);
# (cd /tmp/atd-moped/moped-api; source ./venv/bin/activate; pip install --target ./package -r ./requirements/slimmed_down.txt; deactivate;);


@task(name="Remove API venv")
def remove_api_venv():
    logger.info("Removing API venv")
    venv_path = f"/tmp/atd-moped/moped-api/venv"
    try:
        shutil.rmtree(venv_path)
    except Exception:
        return False
    return True


@task(name="Remove API package folder")
def remove_api_package():
    logger.info("Removing API package folder")
    package_path = f"/tmp/atd-moped/moped-api/package"
    try:
        shutil.rmtree(package_path)
    except Exception:
        return False
    return True


create_api_venv = ShellTask(name="Create API venv", stream_output=True, return_all=True)
install_api_python_libraries = ShellTask(
    name="Install API python dependencies", stream_output=True
)
create_api_zip_archive_libraries = ShellTask(
    name="Add API python libraries to zip archive", stream_output=True
)
add_api_lambda_function_to_archive = ShellTask(
    name="Add API Lambda custom code to archive", stream_output=True
)


@task(name="Check if API lambda function exists")
def does_api_lambda_function_exist(slug):

    lambda_client = boto3.client("lambda")

    function_name = shared.generate_api_lambda_function_name(slug)
    logger.info(f"Checking if lambda function {function_name} exists")
    try:
        response = lambda_client.get_function(FunctionName=function_name)
        logger.info(f"Lambda function ({function_name}) does exist")
        return True
    except Exception:
        logger.info(f"Lambda function ({function_name}) does not exist")
    return False


@task(name="Remove API lambda function")
def remove_api_lambda(slug):

    lambda_client = boto3.client("lambda")

    api_function_name = shared.generate_api_lambda_function_name(slug)
    logger.info(f"Removing API Lambda function: {api_function_name}")

    response = lambda_client.delete_function(FunctionName=api_function_name)
    logger.info(response)
    return response


@task(name="Upload lambda code, register lambda")
def register_api_lambda_via_upload(slug):
    function_name = shared.generate_api_lambda_function_name(slug)
    logger.info(f"Uploading lambda code {function_name}")

    iam_client = boto3.client("iam")
    # TODO
    role = iam_client.get_role(RoleName=IAM_ROLE_FOR_API_LAMBDA)
    logger.info(role)

    lambda_client = boto3.client("lambda")

    zip_file_path = "/tmp/atd-moped/moped-api/activity_log.zip"

    with open(zip_file_path, "rb") as f:
        zipped_code = f.read()

    graphql_endpoint = shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
    graphql_engine_api_key = shared.generate_access_key(slug["basename"])

    response = lambda_client.create_function(
        FunctionName=function_name,
        Runtime="python3.8",
        Handler="app.handler",
        PackageType="Zip",
        Code=dict(ZipFile=zipped_code),
        Role=role["Role"]["Arn"],
        Description=f"AWS Moped : {function_name}",
        Environment={"Variables": {}},
    )

    logger.info(response)
    arn = response["FunctionArn"]
    return arn
