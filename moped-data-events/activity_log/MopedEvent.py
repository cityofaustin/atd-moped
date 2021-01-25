import json, boto3

import requests
from cerberus import Validator

from config import (
    HASURA_HTTP_HEADERS,
    HASURA_ENDPOINT,
    HASURA_EVENT_VALIDATION_SCHEMA,
)


class MopedEvent:
    """
    The Moped Event Class
    """

    HASURA_EVENT_VALIDATION_SCHEMA = None

    HASURA_EVENT_PAYLOAD = {}

    MOPED_PRIMARY_KEY_MAP = {}

    MOPED_GRAPHQL_MUTATION = """
        mutation InsertMopedActivityLog (
          $recordId:Int!,
          $recordType:String!,
          $recordData:jsonb!,
          $description:jsonb!,
          $updatedBy:String,
          $updatedById:Int,
        ) {
          insert_moped_activity_log(objects: {
            record_id: $recordId,
            record_type: $recordType,
            record_data: $recordData,
            description: $description,
            updated_by: $updatedBy,
            updated_by_id: $updatedById,
          }) {
            affected_rows
          }
        }
    """

    def __init__(self, payload: dict, load_primary_keys: bool = True):
        """
        Constructor for Moped Event
        :param payload: The event payload as provided by Lambda/SQS
        :type payload: dict
        :param load_primary_keys: If True, it will download the primary keys from S3. Default: True
        :type load_primary_keys: bool
        """
        self.HASURA_EVENT_PAYLOAD = payload
        self.HASURA_EVENT_VALIDATION_SCHEMA = HASURA_EVENT_VALIDATION_SCHEMA
        if load_primary_keys:
            self.load_primary_keys()

    def __repr__(self) -> str:
        """
        Returns the name of the class as a representation
        :return: The name of the class
        :rtype: str
        """
        return f"MopedEvent({self.get_event_type()})"

    def __str__(self) -> str:
        """
        Returns the value of payload as a string
        :return:
        :rtype: str
        """
        return json.dumps(self.HASURA_EVENT_PAYLOAD)

    def load_payload_from_str(self, payload: str) -> None:
        """
        :param payload: The event payload
        :type payload: str
        :return:
        :rtype: None
        """
        self.HASURA_EVENT_PAYLOAD = json.loads(payload)

    def load_payload_from_file(self, file: str) -> None:
        """
        Loads a json file from file
        :param file: The path to the file
        :type file: str
        """
        with open(file) as fp:
            self.HASURA_EVENT_PAYLOAD = json.load(fp)

    def get_state(self, mode: str = "new") -> dict:
        """
        Returns the old state of the payload.
        :return: The old state of the record as an dictionary
        :rtype: dict
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["event"]["data"][mode]
        except (TypeError, KeyError):
            return {}

    def payload(self) -> dict:
        """
        Returns the current state of payload
        :return: The payload dictionary
        :rtype: dict
        """
        return self.HASURA_EVENT_PAYLOAD

    def can_validate(self) -> bool:
        """
        Helps determine if we can run a validation
        :return: Returns True if it can validate, false otherwise
        :rtype: bool
        """
        return False if self.HASURA_EVENT_VALIDATION_SCHEMA is None else True

    def validate_state(self, mode: str = "old") -> tuple:
        """
        Validates the schema of either the old or new state using Cerberus
        :param mode: The state mode we want to examine, either old or new
        :type mode: str
        :return: True if valid, False otherwise.
        :rtype: bool
        """
        if mode not in ["old", "new"]:
            return False, {"error": f"Invalid mode {mode}, must be either 'old' or 'new'"}

        if self.HASURA_EVENT_PAYLOAD is None:
            return False, {"error": "Empty payload document"}

        if self.HASURA_EVENT_VALIDATION_SCHEMA is None:
            return False, {"error": "Empty validation schema"}

        event_validator = Validator(self.HASURA_EVENT_VALIDATION_SCHEMA)
        return event_validator.validate(document=self.get_state(mode)), event_validator.errors

    def request(self, variables: dict, headers: dict = {}) -> dict:
        """
        Makes the GraphQL query via HTTP
        :param variables: GraphQL variables and values in kay-pair dictionary form
        :type variables: dict
        :param headers: Any additional HTTP Headers
        :type headers: dict
        :return: The HTTP response from Hasura
        :rtype: dict
        """
        response = requests.post(
            url=HASURA_ENDPOINT,
            headers={
                **HASURA_HTTP_HEADERS,
                **headers
            },
            data=json.dumps(
                {
                    "query": self.MOPED_GRAPHQL_MUTATION,
                    "variables": variables
                }
            )
        )
        response.encoding = "utf-8"
        return response.json()

    def load_primary_keys(self):
        """
        Reads the primary key settings
        :return: A dictionary containing the primary key for every table
        :rtype: dict
        """
        s3 = boto3.Session().client('s3')
        s3_object = s3.get_object(Bucket="atd-moped-data-events", Key="settings/moped_primary_keys_staging.json")
        self.MOPED_PRIMARY_KEY_MAP = json.loads(s3_object['Body'].read())

    def get_primary_key(self, table: str, default: str = None) -> None:
        """
        Returns the name of a primary key column for a table
        :param table: The table name
        :type table: str
        :param default: The default value in case it can't find it
        :type default: None
        :return: The name of the primary key field
        :rtype: str
        """
        return self.MOPED_PRIMARY_KEY_MAP.get(table, default)

    def get_event_type(self) -> str:
        """
        Safely retrieves the event type from the event payload
        :return: The name of the table being modified
        :rtype: str
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["table"]["name"]
        except (TypeError, KeyError):
            return ""

    def get_diff(self) -> dict:
        """
        Generates a dictionary with a list of all different values in the payload old and new state
        :return: The dictionary containing the diff
        :rtype: dict
        """
        change_list = []
        old_state = self.get_state("old")
        new_state = self.get_state("new")

        # Gather a list of keys that present a difference in values
        keys_with_diff = list(
            filter(
                lambda k: new_state[k] != old_state[k],  # Compare between old and new state
                new_state.keys()  # For every key in new_state
            )
        )

        for key in keys_with_diff:
            change_list.append({
                "field": key,
                "old": old_state[key],
                "new": new_state[key]
            })

        return change_list

    def get_variables(self) -> dict:
        """
        Builds the variables needed for a Hasura HTTP request
        :return: The dictionary containing all the variables needed
        :rtype: dict
        """
        return {
            "recordId": None,
            "recordType": None,
            "recordData": self.payload(),
            "description": self.get_diff(),
            "updatedBy": None,
            "updatedById": 0,
        }

    def save(self) -> dict:
        """
        Simplifies the request method
        :return: The HTTP response from Hasura
        :rtype: dict
        """
        return self.request(variables=self.get_variables())
