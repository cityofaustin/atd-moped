#
# Server Configuration
#

api_config = {
    "STAGING": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_U2dzkxfTv",
        "COGNITO_APP_CLIENT_ID": "3u9n9373e37v603tbp25gs5fdc",  # client ID you wish to verify user is authenticated against
    },
    "PRODUCTION": {
        "COGNITO_REGION": "us-east-1",
        "COGNITO_USERPOOL_ID": "us-east-1_Zc3pNWX51",
        "COGNITO_APP_CLIENT_ID": "ins01e2a8d3vd8apvnd0jv10c",  # client ID you wish to verify user is authenticated against
    }
}


