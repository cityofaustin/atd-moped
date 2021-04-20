#
# Activity Log SQS Handler
#
import json
import time
import logging


from cerberus import Validator

from config import (
    HASURA_EVENT_VALIDATION_SCHEMA,
)

from MopedEvent import MopedEvent

# Initialize our logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

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


def validate_hasura_event(event: dict) -> tuple:
    """
    Returns True if the event contains required event format.
    :param event: The event to be validated
    :type event: dict
    :return: True if the event is valid, False otherwise
    :rtype: bool
    """
    if event is None:
        return False, {"event": "Empty document"}

    event_validator = Validator(HASURA_EVENT_VALIDATION_SCHEMA)
    return event_validator.validate(document=event), event_validator.errors


def get_event_type(event: dict) -> str:
    """
    Safely retrieves the event type from the event payload
    :param event: The payload event dictionary
    :type event: dict
    :return: The name of the table being modified
    :rtype: str
    """
    try:
        return event["table"]["name"]
    except (TypeError, KeyError):
        return ""


def process_event(event: dict) -> None:
    """
    Processes a single event from Hasura, it compares the old and new
    records, and creates a summary for insertion back against Hasura.
    :param dict event: The single event object
    :return dict:
    """
    # First validate basic format (not actual data)
    event_format_valid, event_format_errors = validate_hasura_event(event)

    if event_format_valid:
        event_type = get_event_type(event)

        if event_type != "":
            # Build event object
            moped_event = MopedEvent(event)
            response = moped_event.save()
            if "errors" in response:
                raise_critical_error(
                    message=f"Error while running GraphQL Query: {json.dumps(response)}",
                    data=event
                )
        else:
            raise_critical_error(
                message=f"Event type not specified",
                data=event
            )
    else:
        raise_critical_error(
            message=f"Invalid event format: {json.dumps(event_format_errors)}",
            data=event
        )


def handler(event, context):
    """
    Event handler main loop. It handles a single or multiple SQS messages.
    :param dict event: One or many SQS messages
    :param dict context: Event context
    """

    logger.info(f"Function: {context.function_name}")
    logger.info(f"Request ID: {context.aws_request_id}")
    logger.info(f"Event: {json.dumps(event)}")

    #
    # Check if the event is a cloudwatch event
    #
    event_source = event.get("source", "none")
    event_type = event.get("detail-type", "none")
    if event_source == "aws.events" \
            and event_type == "Scheduled Event":
        # Return the event so it shows as a successful transaction
        return event

    if "Records" in event:
        for record in event["Records"]:
            time_str = time.ctime()
            if "body" in record:
                try:
                    payload = json.loads(record["body"])
                    process_event(payload)
                except Exception as e:
                    print(f"Start Time: {time_str}", str(e))
                    time_str = time.ctime()
                    print("Done executing: ", time_str)
                    raise_critical_error(
                        message=f"Could not process record: {str(e)}",
                        data=record,
                        exception_type=Exception
                    )