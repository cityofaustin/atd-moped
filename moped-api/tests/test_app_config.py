#!/usr/bin/env python
import pytest


class TestAppConfig:
    @pytest.fixture(scope="class")
    def api_config(self):
        """
        Mock the hasura https endpoint & admin secret
        """
        from config import api_config
        api_config["HASURA_HTTPS_ENDPOINT"] = "HASURA_TEST"
        api_config["HASURA_ADMIN_SECRET"] = "HASURA_TEST"
        yield api_config

    def test_api_config_initializes(self, api_config):
        """
        Makes sure the configuration initializes the environment variables
        """
        assert "API_ENVIRONMENT" in api_config
        assert api_config.get("API_ENVIRONMENT", "") == "STAGING"

    def test_api_config_hasura_settings(self, api_config):
        """
        Check the hasura endpoint
        """
        assert "HASURA_HTTPS_ENDPOINT" in api_config
        assert "HASURA_ADMIN_SECRET" in api_config
        assert api_config.get("HASURA_HTTPS_ENDPOINT", "") == "HASURA_TEST"
        assert api_config.get("HASURA_ADMIN_SECRET", "") == "HASURA_TEST"

    def test_api_config_cognito_settings(self, api_config):
        """
        Check for Cognito settings
        """
        assert "COGNITO_APP_CLIENT_ID" in api_config
        assert "COGNITO_USERPOOL_ID" in api_config
        assert "COGNITO_REGION" in api_config
        # We don't need to check for values

    def test_get_config(self):
        """
        Makes sure it retrieves a value in the current environment
        """
        from config import get_config
        assert get_config("HASURA_HTTPS_ENDPOINT") == "HASURA_TEST"
        assert get_config("", "INVALID_TEST") == "INVALID_TEST"
        assert get_config(None, "INVALID_TEST") == "INVALID_TEST"
        assert get_config(None, None) is None
