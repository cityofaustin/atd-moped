#
# Server Configuration
#

api_config = {
    "STAGING": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_U2dzkxfTv",
        "COGNITO_APP_CLIENT_ID": "3u9n9373e37v603tbp25gs5fdc",  # client ID you wish to verify user is authenticated against
        "DYNAMO_DB_TABLE_NAME": "atd-moped-users-staging",
        "AWS_COGNITO_DYNAMO_SECRET_NAME": "ATD_MOPED_USERS_COGNITO_DYNAMODB_STAGING",
    },
    "PRODUCTION": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_Zc3pNWX51",
        "COGNITO_APP_CLIENT_ID": "ins01e2a8d3vd8apvnd0jv10c",  # client ID you wish to verify user is authenticated against
        "DYNAMO_DB_TABLE_NAME": "atd-moped-users-production",
        "AWS_COGNITO_DYNAMO_SECRET_NAME": "ATD_MOPED_USERS_COGNITO_DYNAMODB_STAGING",
    },
}

