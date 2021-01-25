#!/usr/bin/env python
import json, pdb

from MopedEvent import MopedEvent


def load_json_file(file: str) -> dict:
    """
    Parses a JSON from file
    :param file: File name
    :type file: str
    :return: The file contents as a dictionary
    :rtype: dict
    """
    with open(file) as filePointer:
            return json.load(fp=filePointer)


class TestMopedEvent:
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

    def test_load_primary_keys(self) -> None:
        """
        Tests whether the primary keys are going to be loaded
        """
        moped_event = MopedEvent(self.event_update)
        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
