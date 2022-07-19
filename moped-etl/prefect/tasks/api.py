import json
import boto3
import os

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

# set up the prefect logging system
logger = prefect.context.get("logger")

AWS_DEFAULT_REGION = os.environ["AWS_DEFAULT_REGION"]
AWS_SECRETS_MANAGER_ARN_PREFIX = os.environ["AWS_SECRETS_MANAGER_ARN_PREFIX"]
AWS_STAGING_DYNAMO_DB_TABLE_NAME = os.environ["AWS_STAGING_DYNAMO_DB_TABLE_NAME"]
AWS_STAGING_DYNAMO_DB_ARN = os.environ["AWS_STAGING_DYNAMO_DB_ARN"]
AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME = os.environ[
    "AWS_STAGING_DYNAMO_DB_ENCRYPT_KEY_SECRET_NAME"
]
AWS_STAGING_COGNITO_USER_POOL_ID = os.environ["AWS_STAGING_COGNITO_USER_POOL_ID"]
AWS_STAGING_COGNITO_APP_ID = os.environ["AWS_STAGING_COGNITO_APP_ID"]
AWS_STAGING_COGNITO_USER_POOL_ARN = os.environ["AWS_STAGING_COGNITO_USER_POOL_ARN"]
VPC_SUBNET_A = os.environ["VPC_SUBNET_A"]
VPC_SUBNET_B = os.environ["VPC_SUBNET_B"]


# Make sure that we create a constistent name to add and remove the API config secret
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
        "COGNITO_DYNAMO_SECRET_KEY": "",
        "HASURA_HTTPS_ENDPOINT": "",
        "HASURA_ADMIN_SECRET": "",
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
    logger.info(response)


@task(name="Remove test API config Secrets Manager entry")
def remove_moped_api_secrets_entry(basename):
    logger.info("Removing API secret config")
    client = boto3.client("secretsmanager", region_name=AWS_DEFAULT_REGION)
    secret_name = create_secret_name(basename)

    response = client.delete_secret(
        SecretId=secret_name,
        ForceDeleteWithoutRecovery=True,
    )
    logger.info(response)


# Create Zappa deployment configuration to deploy and undeploy Lambda + API Gateway
def create_zappa_config(basename):
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
                "MOPED_API_HASURA_APIKEY": "thisisatest",
                "MOPED_API_HASURA_SQS_URL": "thisisatest",
                "MOPED_API_UPLOADS_S3_BUCKET": "thisisatest",
            },
            "extra_permissions": [
                {
                    "Effect": "Allow",
                    "Action": "secretsmanager:GetSecretValue",
                    "Resource": [
                        f"{AWS_STAGING_DYNAMO_DB_ARN}",
                        f"{AWS_SECRETS_MANAGER_ARN_PREFIX}:{basename}",
                    ],
                },
                {
                    "Effect": "Allow",
                    "Action": "cognito-idp:*",
                    "Resource": f"{AWS_STAGING_COGNITO_USER_POOL_ARN}",
                },
            ],
            "vpc_config": {"SubnetIds": [VPC_SUBNET_A, VPC_SUBNET_B]},
        }
    }
    return zappa_config


create_api_task = ShellTask(name="Run API Zappa deploy bash command")


@task(name="Create API Zappa deploy bash command")
def create_moped_api_deploy_command(basename):
    logger.info("Creating API Zappa deploy command")
    zappa_config = create_zappa_config(basename)
    api_project_path = "./atd-moped/moped-api/"

    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa deploy requires an active virtual environment
    # then use a subshell to zappa deploy in moped-api project folder
    return f"""python3 -m venv venv;
    . venv/bin/activate;
    (cd {api_project_path} &&
    pip install wheel &&
    pip install -r ./requirements/moped_test.txt &&
    zappa deploy {basename})
    deactivate;
    """


remove_api_task = ShellTask(name="Run API Zappa undeploy bash command")


@task(name="Create API Zappa undeploy bash command")
def create_moped_api_undeploy_command(basename):
    logger.info("Creating API Zappa undeploy bash command")
    zappa_config = create_zappa_config(basename)
    api_project_path = "./atd-moped/moped-api/"

    # Write Zappa config to moped-api project folder
    with open(f"{api_project_path}zappa_settings.json", "w") as f:
        json.dump(zappa_config, f)

    # zappa undeploy with auto-confirm delete flag
    return "(cd {api_project_path} && zappa undeploy {basename} --yes)"
