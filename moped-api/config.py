#
# Server Configuration
#

import os
from typing import Optional

api_environment = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")

api_config = {
    "API_ENVIRONMENT": api_environment,
    "STAGING": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_U2dzkxfTv",
        "COGNITO_APP_CLIENT_ID": "3u9n9373e37v603tbp25gs5fdc",
        "HASURA_HTTPS_ENDPOINT": os.getenv("HASURA_HTTPS_ENDPOINT", None),
        "HASURA_ADMIN_SECRET": os.getenv("HASURA_ADMIN_SECRET", None),
    },
    "PRODUCTION": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_Zc3pNWX51",
        "COGNITO_APP_CLIENT_ID": "ins01e2a8d3vd8apvnd0jv10c",
        "HASURA_HTTPS_ENDPOINT": os.getenv("HASURA_HTTPS_ENDPOINT", None),
        "HASURA_ADMIN_SECRET": os.getenv("HASURA_ADMIN_SECRET", None),
    }
}


def get_config(key: str, default: str = None) -> Optional[str]:
    """
    Attempts to get the configuration setting for a current environment value
    :param str key: The configuration key name
    :param str default: The configuration default value, in case it is not found.
    :return str: The configuration value
    """
    if isinstance(key, str):
        return api_config[api_environment].get(key, default)
    else:
        return default
