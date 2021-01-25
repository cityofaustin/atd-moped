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

    def test_init(self) -> None:
        """
        Tests whether the primary keys are going to be loaded
        """
        moped_event = MopedEvent(self.event_update)
        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event.MOPED_PRIMARY_KEY_MAP != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD != {}

        moped_event = MopedEvent(self.event_insert)
        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event.MOPED_PRIMARY_KEY_MAP != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD != {}

        moped_event = MopedEvent(None)
        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event.MOPED_PRIMARY_KEY_MAP != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD is None

    def test_get_primary_key(self) -> None:
        """
        Tests if we can get a primary key (once map is loaded)
        """
        moped_event = MopedEvent(self.event_update)

        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
        assert "activity_id" == moped_event.get_primary_key("moped_activity_log")
        assert "user_id" == moped_event.get_primary_key("moped_users")
        assert "project_id" == moped_event.get_primary_key("moped_project")
        assert moped_event.get_primary_key("nowhere_to_be_found") is None
        assert moped_event.get_primary_key(None) is None
