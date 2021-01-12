#
# Resolves the location for a crash.
#
import json
import requests
import time
import os

HASURA_ADMIN_SECRET = os.getenv("HASURA_ADMIN_SECRET", "")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT", "")

# Prep Hasura query
HEADERS = {
    "Content-Type": "application/json",
    "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
}


def raise_critical_error(
        message: str,
        data: dict = None,
        exception_type: object = Exception
):
    """
    Logs an error in Lambda
    :param dict data: The event data
    :param str message: The message to be logged
    :param object exception_type: An optional exception type object
    :return:
    """
    critical_error_message = json.dumps(
        {
            "event_object": data,
            "message": message,
        }
    )
    print(critical_error_message)
    raise exception_type(critical_error_message)


def process_event(event: dict) -> dict:
    """
    Processes a single event from Hasura, it compares the old and new
    records, and creates a summary for insertion back against Hasura.
    :param dict event: The single event object
    :return dict:
    """
    print(event)


def handler(event, context):
    """
    Event handler main loop. It handles a single or multiple SQS messages.
    :param dict event: One or many SQS messages
    :param dict context: Event context
    """

    if "Records" in event:
        for record in event["Records"]:
            time_str = time.ctime()
            if "body" in record:
                try:
                    process_event(record["body"])
                except Exception as e:
                    print(f"Start Time: {time_str}", str(e))
                    time_str = time.ctime()
                    print("Done executing: ", time_str)
                    raise_critical_error(
                        message=f"Could not process record: {str(e)}",
                        data=record,
                        exception_type=Exception
                    )