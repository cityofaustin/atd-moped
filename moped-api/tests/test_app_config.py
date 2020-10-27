#!/usr/bin/env python
import os
import pytest


class TestAppConfig:
    @pytest.fixture(scope="class")
    def api_config(self):
        """
        Mock the hasura https endpoint & admin secret
        """
        os.environ["HASURA_HTTPS_ENDPOINT"] = "HASURA_TEST"
        os.environ["HASURA_ADMIN_SECRET"] = "HASURA_TEST"
        from config import api_config
        yield api_config

    @pytest.fixture(scope="function")
    def api_environment(self):
        """
        Mock the api_environment variable
        """
        from config import api_environment
        yield api_environment

    @pytest.fixture(scope="function")
    def api_environments(self):
        yield ["PRODUCTION", "STAGING"]

    def test_api_config_initializes(self, api_config):
        """
        Makes sure the configuration initializes the environment variables
        """
        assert "API_ENVIRONMENT" in api_config
        assert api_config.get("API_ENVIRONMENT", "") == "STAGING"

    def test_api_environment_initializes(self, api_environment):
        """
        Makes sure the configuration initializes the environment variables
        """
        assert api_environment == "STAGING"

    def test_api_config_hasura_settings(self, api_config, api_environments):
        """
        Check the hasura endpoint
        """
        for CURRENT_ENVIRONMENT in api_environments:
            assert "HASURA_HTTPS_ENDPOINT" in api_config[CURRENT_ENVIRONMENT]
            assert "HASURA_ADMIN_SECRET" in api_config[CURRENT_ENVIRONMENT]
            assert api_config[CURRENT_ENVIRONMENT].get("HASURA_HTTPS_ENDPOINT", "") == "HASURA_TEST"
            assert api_config[CURRENT_ENVIRONMENT].get("HASURA_ADMIN_SECRET", "") == "HASURA_TEST"

    def test_api_config_cognito_settings(self, api_config, api_environments):
        """
        Check for Cognito settings
        """
        for CURRENT_ENVIRONMENT in api_environments:
            assert "COGNITO_APP_CLIENT_ID" in api_config[CURRENT_ENVIRONMENT]
            assert "COGNITO_USERPOOL_ID" in api_config[CURRENT_ENVIRONMENT]
            assert "COGNITO_REGION" in api_config[CURRENT_ENVIRONMENT]
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
