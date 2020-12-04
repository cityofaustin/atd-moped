#!/usr/bin/env python
from config import *


class TestConfig:
    def test_config_environment_variables(self):
        """
        Checks that the environment variables are loaded correctly
        :return:
        """
        assert AWS_ATD_MOPED_JWK_KEYS_LOAD == "FALSE"
        assert AWS_ATD_MOPED_REGION == "us-east-1"
        assert AWS_ATD_MOPED_USER_POOL == "us-east-1_Ub8l42e3z"
        assert AWS_ATD_MOPED_APP_CLIENT_ID == "J7CqHVrjtt537n49WRW43oB8ph"
        assert AWS_ATD_MOPED_API_GATEWAY_ARN == "arn:aws:execute-api:us-east-1:*:og37y2s8aA"
        assert AWS_ATD_MOPED_JWK_KEYS == None

    def test_config_jwks_endpoint(self):
        """
        Make sure the endpoint url is generated as expected
        :return:
        """
        assert AWS_ATD_MOPED_JWKS_ENDPOINT == "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Ub8l42e3z/.well-known/jwks.json"
