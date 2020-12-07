#!/usr/bin/env python
from jwt import *


class TestJWK:
    @classmethod
    def setup_class(cls):
        # Gives us access to the app class
        cls.mock_invalid_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDczNjkxNjIsImV4cCI6MTYzODkwNTE2MiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.r1DlrbKcR_J9W73ryQ3lMmfSP4MHux5Qwu0ALXegI0Q"
        cls.mock_cognito_token = "..."
        cls.mock_sso_token = "..."

    @classmethod
    def teardown_class(cls):
        # Discards the app instance we have
        cls.mock_token_invalid = None

    def test_verify_jwt_token_edgecases(self):
        valid, claims = verify_jwt_token(token="ABCDEF1234567890!@#&*()")
        assert valid is False
        assert isinstance(claims, dict)
        valid, claims = verify_jwt_token(token=None)
        assert valid is False
        assert isinstance(claims, dict)
        valid, claims = verify_jwt_token(token="1239")
        assert valid is False
        assert isinstance(claims, dict)
        valid, claims = verify_jwt_token(token=1235)
        assert valid is False
        assert isinstance(claims, dict)

    def test_verify_jwt_token_invalid(self):
        """
        Tests if verify_jwt_token works when the token is valid
        """
        valid, claims = verify_jwt_token(token=self.mock_invalid_token)
        assert valid is False
        assert isinstance(claims, dict)

    # def test_verify_jwt_token_cognito(self):
    #     """
    #     Tests if verify_jwt_token works when the token is valid
    #     """
    #     valid, claims = verify_jwt_token(token=self.mock_cognito_token)
    #     assert valid is False
    #     assert isinstance(claims, dict)
    #
    # def test_verify_jwt_token_sso(self):
    #     """
    #     Tests if verify_jwt_token works when the token is valid
    #     """
    #     valid, claims = verify_jwt_token(token=self.mock_sso_token)
    #     assert valid is False
    #     assert isinstance(claims, dict)
