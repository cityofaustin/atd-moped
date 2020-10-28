#!/usr/bin/env python
import pytest


class TestAppGraphQL:

    @pytest.fixture(scope="class", autouse=True)
    def api_config(self):
        """
        Mock the hasura https endpoint & admin secret
        """
        from config import api_config
        api_config["HASURA_HTTPS_ENDPOINT"] = "http://localhost:5000"
        api_config["HASURA_ADMIN_SECRET"] = "SUPER_SECRET_HERE"
        yield api_config

    def mock_hasura(*args, **kwargs):
        (req, *_) = args  # Unpack request tuple

        # Check headers
        if "Content-Type" not in req.headers:
            raise RuntimeError("Content-Type is not in the headers")

        if "X-Hasura-Admin-Secret" not in req.headers:
            raise RuntimeError("X-Hasura-Admin-Secret is not in the headers")

        admin_secret = req.headers.get("X-Hasura-Admin-Secret", None)

        if admin_secret is None:
            raise RuntimeError("Admin secret not provided")

        if admin_secret != "SUPER_SECRET_HERE":
            raise RuntimeError("Invalid admin secret")

    @pytest.mark.server(
        url='/v1/query',
        response={'query': 'ok'},
        method='POST',
        callback=mock_hasura
    )
    @pytest.mark.server(
        url='/v1/graphql',
        response={'query': 'ok'},
        method='POST',
        callback=mock_hasura
    )
    def test_run_query(self):
        from graphql import run_query

        # Test for valid secret and endpoint
        response = run_query(
            query="{}",
            variables={},
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000",
                "HASURA_ADMIN_SECRET": "SUPER_SECRET_HERE"
            }
        )
        assert response.status_code == 200
        assert response.json().get("query") == "ok"

        # Test for bad secret
        response_bad_secret = run_query(
            query="{}",
            variables={},
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000",
                "HASURA_ADMIN_SECRET": "INVALID_SECRET"
            }
        )
        assert response_bad_secret.status_code == 500

        # Test for bad URL
        response_bad_url = run_query(
            query="{}",
            variables={},
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000/v1/graphql/run_query/nowhere",
            }
        )

        assert response_bad_url.status_code == 404

    def test_run_sql(self):

        from graphql import run_sql

        # Test for bad secret
        response_run_sql = run_sql(
            query="",
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000",
                "HASURA_ADMIN_SECRET": "SUPER_SECRET_HERE"
            }
        )
        assert response_run_sql.status_code == 200
        assert response_run_sql.json().get("query") == "ok"

        # Test for bad secret
        response_bad_secret = run_sql(
            query="{}",
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000",
                "HASURA_ADMIN_SECRET": "INVALID_SECRET"
            }
        )

        assert response_bad_secret.status_code == 500

        # Test for bad URL
        response_bad_url = run_sql(
            query="{}",
            alternative_conf={
                "HASURA_HTTPS_ENDPOINT": "http://localhost:5000/v1/graphql/run_sql/nowhere",
            }
        )

        assert response_bad_url.status_code == 404
