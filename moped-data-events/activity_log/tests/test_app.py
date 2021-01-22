#!/usr/bin/env python
import json, pdb

from .helpers import load_json_file

from app import *


class TestApp:
    eventList = {}

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
        valid, errors = validate_hasura_event(self.event_insert)
        assert valid
        assert errors == {}

        valid, errors = validate_hasura_event(self.event_update)
        assert valid
        assert errors == {}

        valid, errors = validate_hasura_event(None)
        assert valid == False
        assert errors != {}
