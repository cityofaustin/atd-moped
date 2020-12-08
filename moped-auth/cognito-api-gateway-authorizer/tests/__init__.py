import sys, os
sys.path.append('../')

# Generate a series of mock environment values (all fictional)
os.environ["AWS_ATD_MOPED_JWK_KEYS_LOAD"] = "FALSE"
os.environ["AWS_ATD_MOPED_REGION"] = "us-east-1"
os.environ["AWS_ATD_MOPED_USER_POOL"] = "us-east-1_Ub8l42e3z"
os.environ["AWS_ATD_MOPED_APP_CLIENT_ID"] = "J7CqHVrjtt537n49WRW43oB8ph"
os.environ["AWS_ATD_MOPED_API_GATEWAY_ARN"] = "arn:aws:execute-api:us-east-1:*:og37y2s8aA"

# Paste your valid tokens here...
os.environ["AWS_ATD_MOPED_VALID_COGNITO"] = "..."
os.environ["AWS_ATD_MOPED_VALID_SSO"] = "..."
