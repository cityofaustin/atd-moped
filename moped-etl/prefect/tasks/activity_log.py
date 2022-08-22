import os
import json
import boto3
import boto3.session
import shutil
import time
from datetime import timedelta

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
        "Description": f"Test Moped Data Event: atd-moped-events-activity_log_{activity_log_endpoint}",
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

    session = boto3.session.Session()
    sqs_client = session.client("sqs")

    queue_url = shared.create_activity_log_queue_url(basename)
    response = sqs_client.delete_queue(QueueUrl=queue_url)
    logger.info(response)
    return response










@task(name="Get Lambda / SQS Mapping UUID")
def get_lambda_sqs_mapping_uuid(queue_arn, lambda_arn):
    logger.info("Getting Lambda / SQS Mapping UUID")
    session = boto3.session.Session()
    lambda_client = session.client("lambda")
    response = lambda_client.list_event_source_mappings(
        EventSourceArn=queue_arn, FunctionName=lambda_arn
    )
    logger.info(response)
    uuid = response["EventSourceMappings"][0]["UUID"]
    logger.info(f"Found UUID: {uuid}")
    return uuid


@task(name="Remove Lambda / SQS Mapping")
def remove_lambda_sqs_mappings(mapping_uuid):
    logger.info(f"Removing Lambda / SQS Mapping: {mapping_uuid}")
    session = boto3.session.Session()
    lambda_client = session.client("lambda")
    response = lambda_client.delete_event_source_mapping(UUID=mapping_uuid)
    logger.info(response)
    return response


@task(name="Wait until UUID clears", max_retries=12, retry_delay=timedelta(seconds=10))
def spin_until_lambda_sqs_mappings_empty(mapping_uuid):
    logger.info(f"Waiting until Lambda / SQS Mapping: {mapping_uuid} is empty")
    session = boto3.session.Session()
    lambda_client = session.client("lambda")
    try:
        response = lambda_client.get_event_source_mapping(UUID=mapping_uuid)
        logger.info(response)
    except lambda_client.exceptions.ResourceNotFoundException:
        return True
    raise # i feel like there should be a better way to have a task fail?


@task(name="Check if mapping between SQS and Lambda exists")
def check_existing_lambda_sqs_mappings(queue_arn, lambda_arn):
    logger.info("Checking if mapping between SQS and Lambda exists")
    session = boto3.session.Session()
    lambda_client = session.client("lambda")
    response = lambda_client.list_event_source_mappings(
        EventSourceArn=queue_arn, FunctionName=lambda_arn
    )
    logger.info(response)
    if len(response["EventSourceMappings"]) > 0:
        logger.info("Mapping between SQS and Lambda exists")
        return True
    else:
        logger.info("Mapping between SQS and Lambda does not exist")
        return False


@task(name="Link SQS to Lambda")
def link_lambda_to_sqs(slug, queue_arn, lambda_arn):
    logger.info("Linking SQS to Lambda")

    session = boto3.session.Session()
    lambda_client = session.client("lambda")

    response = lambda_client.create_event_source_mapping(
        EventSourceArn=queue_arn,
        FunctionName=lambda_arn,
    )
    
    logger.info(response)
    return True


@task(name="Get SQS ARN")
def get_sqs_arn(url):
    logger.info(f"Getting SQS ARN for {url}")
    session = boto3.session.Session()
    sqs = session.client("sqs")
    response = sqs.get_queue_attributes(QueueUrl=url, AttributeNames=["QueueArn"])
    logger.info(response)
    return response["Attributes"]["QueueArn"]

@task(name="Check if Activity Log SQS exists")
def check_sqs(slug):
    logger.info("Checking if Activity Log SQS exists")

    session = boto3.session.Session()
    sqs = session.client("sqs")

    queue_name = shared.generate_activity_log_queue_name(slug)

    response = sqs.list_queues(QueueNamePrefix=queue_name)

    #response = sqs_client.get_queue_attributes(QueueUrl=queue_url, AttributeNames=["QueueArn"])
    logger.info(response)

    if not "QueueUrls" in response:
        logger.info("Activity Log SQS does not exist")
        return False
    else:
        logger.info("Activity Log SQS exists")
        return True

@task(name="Remove Activity Log SQS")
def remove_sqs(slug):
    logger.info("Removing Activity Log SQS")

    session = boto3.session.Session()
    sqs = session.client("sqs")

    queue_name = shared.generate_activity_log_queue_name(slug)
    list_response = sqs.list_queues(QueueNamePrefix=queue_name)

    delete_response = sqs.delete_queue(QueueUrl=list_response["QueueUrls"][0])
    logger.info(delete_response)

    return delete_response

@task(name="Wait 60 seconds after deletion, per docs")
def wait_60_seconds_for_sqs_to_cool_down():
    logger.info("Waiting 60 seconds")
    time.sleep(60)
    return True

@task(name="Create Activity Log SQS")
def create_sqs(slug):
    logger.info("Creating Activity Log SQS")

    session = boto3.session.Session()
    sqs = session.client("sqs")

    queue_name = shared.generate_activity_log_queue_name(slug)

    response = sqs.create_queue(QueueName=queue_name)
    logger.info(response)
    return response["QueueUrl"]

create_activity_log_venv = ShellTask(name="Create venv", stream_output=True, return_all=True)
install_python_libraries = ShellTask(name="Install python dependencies", stream_output=True)
create_zip_archive_libraries = ShellTask(name="Add python libraries to zip archive", stream_output=True)
add_lambda_function_to_archive = ShellTask(name="Add Lambda custom code to archive", stream_output=True)

@task(name="Remove activity log venv")
def remove_activity_log_venv():
    logger.info("Removing Activity Log venv")
    venv_path = f"/tmp/atd-moped/moped-data-events/activity_log/venv"
    try:
        shutil.rmtree(venv_path)
    except Exception:
        return False
    return True

@task(name="Remove activity log package folder")
def remove_activity_log_package():
    logger.info("Removing Activity Log package folder")
    package_path = f"/tmp/atd-moped/moped-data-events/activity_log/package"
    try:
        shutil.rmtree(package_path)
    except Exception:
        return False
    return True


@task(name="Remove activity log lambda function")
def remove_activity_log_lambda(slug):

    session = boto3.session.Session()
    lambda_client = session.client("lambda")

    activity_log_function_name = shared.generate_activity_log_lambda_function_name(slug)
    logger.info(f"Removing Activity Log Lambda function: {activity_log_function_name}")

    response = lambda_client.delete_function(FunctionName=activity_log_function_name)
    logger.info(response)
    return response

@task(name="Check if lambda function exists")
def does_lambda_function_exist(slug):

    session = boto3.session.Session()
    lambda_client = session.client('lambda')

    function_name = shared.generate_activity_log_lambda_function_name(slug)
    logger.info(f"Checking if lambda function {function_name} exists")
    try:
        response = lambda_client.get_function(FunctionName=function_name)
        logger.info(f"Lambda function ({function_name}) does exist")
        return True
    except Exception:
        logger.info(f"Lambda function ({function_name}) does not exist")
    return False

@task(name="Upload lambda code, register lambda")
def register_lambda_via_upload(slug):
    function_name = shared.generate_activity_log_lambda_function_name(slug) 
    logger.info(f"Uploading lambda code {function_name}")
    
    session = boto3.session.Session()
    iam_client = session.client('iam')
    role = iam_client.get_role(RoleName=IAM_ROLE_FOR_ACTIVITY_LOG_LAMBDA)
    logger.info(role)
    
    session = boto3.session.Session()
    lambda_client = session.client('lambda')

    zip_file_path = '/tmp/atd-moped/moped-data-events/activity_log/activity_log.zip'


    with open(zip_file_path, 'rb') as f:
        zipped_code = f.read()

    graphql_endpoint = shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
    graphql_engine_api_key = shared.generate_access_key(slug["basename"])

    response = lambda_client.create_function(
        FunctionName=function_name,
        Runtime='python3.8',
        Handler='app.handler',
        PackageType="Zip",
        Code=dict(ZipFile=zipped_code),
        Role=role['Role']['Arn'],
        Description=f"AWS Moped Data Event: {function_name}",
        Environment={
            "Variables": {
                # We could probably create a helper so this and the ECS Route53 CNAME always match
                "HASURA_ENDPOINT": graphql_endpoint,
                "HASURA_ADMIN_SECRET": graphql_engine_api_key,
                "API_ENVIRONMENT": "TEST",
                "COGNITO_DYNAMO_TABLE_NAME": "atd-moped-users-staging",
            }
        }
    )

    logger.info(response)
    arn = response["FunctionArn"]
    return arn