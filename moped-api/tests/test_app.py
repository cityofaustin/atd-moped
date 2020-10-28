#!/usr/bin/env python
import json, pdb
from unittest.mock import patch

# Imports the Flask application
from app import app


class TestApp:
    @classmethod
    def setup_class(cls):
        # Gives us access to the app class
        cls.app = app
        cls.app.config["TESTING"] = True
        # Allows us to have a client for every test we make via self
        cls.client = cls.app.test_client()

    @classmethod
    def teardown_class(cls):
        # Discards the app instance we have
        cls.app = None
        cls.client = None

    @staticmethod
    def parse_response(response: bytes) -> dict:
        """
        Parses a response from Flask into a JSON dict
        :param bytes response: The response bytes string
        :return dict:
        """
        return json.loads(response.decode("utf-8"))

    def test_app_initializes(self):
        """Start with a blank database."""
        response = self.client.get("/")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "message" in response_dict
        assert "MOPED API Available" in response_dict.get("message", "")

