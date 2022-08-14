import hashlib


def form_graphql_endpoint_hostname(basename):
    host = basename + "-graphql.moped-test.austinmobility.io"
    return host

    
def generate_api_key(basename):
    sha_input = basename + SHA_SALT + "api"
    api_key = hashlib.sha256(sha_input.encode()).hexdigest()
    return api_key

def create_activity_log_queue_url(basename):
    aws_queue_name = create_activity_log_aws_name(basename)
    return f"{MOPED_ACTIVITY_LOG_QUEUE_URL_PREFIX}/{aws_queue_name}"


def generate_access_key(basename):
    sha_input = basename + SHA_SALT + "ecs"
    graphql_engine_api_key = hashlib.sha256(sha_input.encode()).hexdigest()
    return graphql_engine_api_key
