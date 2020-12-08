#!/usr/bin/env python
import os
import pdb
import json
from handler import *


class TestHandler:
    @classmethod
    def setup_class(cls):
        # Gives us access to the app class
        cls.mock_invalid_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDczNjkxNjIsImV4cCI6MTYzODkwNTE2MiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.r1DlrbKcR_J9W73ryQ3lMmfSP4MHux5Qwu0ALXegI0Q"
        cls.mock_cognito_token = os.getenv("AWS_ATD_MOPED_VALID_COGNITO", "")
        cls.mock_sso_token = os.getenv("AWS_ATD_MOPED_VALID_SSO", "")
        cls.mock_context = {
            "function_name": "handler",
            "aws_request_id": "not_implemented",
        }

    @classmethod
    def teardown_class(cls):
        # Discards the app instance we have
        cls.mock_token_invalid = None

    @staticmethod
    def build_header_string(token: str) -> str:
        """
        Builds an HTTP Authorization header
        :param str token: The the token to be used in the header
        :return str: The HTTP Header value
        """
        if not isinstance(token, str) or str(token) == "":
            return ""

        return f"Bearer {token}"

    def test_build_header_string(self):
        assert self.build_header_string(token="Token") == "Bearer Token"
        assert self.build_header_string(token=123) == ""
        assert self.build_header_string(token=None) == ""
        assert self.build_header_string(token={}) == ""

    def test_handler_valid_cognito(self):
        mock_event = {
            "authorizationToken": self.build_header_string(
                token=self.mock_cognito_token
            ),
        }
        policy = handler(event=mock_event, context=self.mock_context)
        assert json.dumps(policy) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "execute-api:Invoke", "Resource": "arn:aws:execute-api:us-east-1:*:og37y2s8aA/*/*/*/"}]}}'


    def test_handler_valid_sso(self):
        mock_event = {
            "authorizationToken": self.build_header_string(
                token=self.mock_sso_token
            ),
        }
        policy = handler(event=mock_event, context=self.mock_context)
        assert json.dumps(
            policy) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "execute-api:Invoke", "Resource": "arn:aws:execute-api:us-east-1:*:og37y2s8aA/*/*/*/"}]}}'


    def test_handler_invalid_token(self):
        mock_event = {
            "authorizationToken": self.build_header_string(
                token=self.mock_invalid_token
            ),
        }
        policy = handler(event=mock_event, context=self.mock_context)
        assert json.dumps(
            policy) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "Deny", "Action": "execute-api:Invoke", "Resource": "arn:aws:execute-api:us-east-1:*:og37y2s8aA/*/*/*/"}]}}'
