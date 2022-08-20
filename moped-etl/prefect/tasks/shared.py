import os
import hashlib


SHA_SALT = os.environ["SHA_SALT"]
MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX = os.environ["MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX"]
ZAPPA_PROJECT_NAME = os.environ["ZAPPA_PROJECT_NAME"]

def form_graphql_endpoint_hostname(basename):
    host = basename + "-graphql.moped-test.austinmobility.io"
    return host

def generate_api_key(basename):
    sha_input = basename + SHA_SALT + "api"
    api_key = hashlib.sha256(sha_input.encode()).hexdigest()
    return api_key

def generate_api_lambda_function_name(basename):
    return f"{ZAPPA_PROJECT_NAME}-{basename}"

def create_activity_log_aws_name(basename, function_name):
    return f"atd-moped-events-{function_name}_{basename}"

def create_activity_log_queue_url(basename, function_name):
    aws_queue_name = create_activity_log_aws_name(basename, function_name)
    return f"{MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX}/{aws_queue_name}"

def generate_access_key(basename):
    sha_input = basename + SHA_SALT + "ecs"
    graphql_engine_api_key = hashlib.sha256(sha_input.encode()).hexdigest()
    return graphql_engine_api_key



def generate_activity_log_lambda_function_name(slug):
    return slug["awslambda"] +  'activity_log'

def generate_activity_log_api_gateway_name(slug):
    return slug["awslambda"] + 'activity_log'