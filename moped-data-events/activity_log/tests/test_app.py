#!/usr/bin/env python
import pytest, json, pdb
from pytest_mock import MockerFixture
from .helpers import *

import app


class TestApp:

    @classmethod
    def setup_class(cls) -> None:
        # Gives us access to the app class
        cls.event_update = load_json_file("tests/moped_project/dummy_event_update.json")
        cls.event_insert = load_json_file("tests/moped_project/dummy_event_insert.json")

    @classmethod
    def teardown_class(cls) -> None:
        # Discards the app instance we have
        cls.event_update = None
        cls.event_insert = None

    def test_is_valid_hasura_event(self) -> None:
        """
        Basic testing of the Cerberus validator
        """
        valid, errors = app.validate_hasura_event(self.event_insert)
        assert valid
        assert errors == {}

        valid, errors = app.validate_hasura_event(self.event_update)
        assert valid
        assert errors == {}

        valid, errors = app.validate_hasura_event(None)
        assert valid == False
        assert errors != {}

    def test_get_event_type(self) -> None:
        """
        Basic testing of the Cerberus validator
        """
        event_type = app.get_event_type(self.event_insert)
        assert event_type == "moped_project"

        event_type = app.get_event_type(self.event_update)
        assert event_type == "moped_project"

        event_type = app.get_event_type(None)
        assert event_type == ""
