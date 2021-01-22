import json


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


def create_sqs_event(event: dict) -> dict:
    """
    Wraps the event in an SQS-like format
    :param event: The event dictionary
    :type event: dict
    :return: The "Records" dictionary
    :rtype: dict
    """
    return {
        "Records": [
            {
                "body": event
            }
        ]
    }
