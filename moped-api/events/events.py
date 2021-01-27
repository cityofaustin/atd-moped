import hashlib, json, boto3, os, datetime
from flask import Blueprint, jsonify, request

# Import our custom code
from requests import Response

events_blueprint = Blueprint('events_blueprint', __name__)

# Hasura Config
HASURA_EVENT_API = os.getenv("MOPED_API_HASURA_APIKEY", "")
HASURA_EVENTS_SQS_URL = os.getenv("MOPED_API_HASURA_SQS_URL", "")
MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "")


@events_blueprint.route('/', methods=["GET"])
def events_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    now = datetime.datetime.now()
    return jsonify(
        {
            "message": "MOPED API Available - Events - Health Check - Available @ %s"
            % now.strftime("%Y-%m-%d %H:%M:%S")
        }
    )


#
# You may also use the normalize_claims decorator
# along with the claims parameter to have a fully parsed claims dict
#
@events_blueprint.route("/", methods=["PUT", "POST"])
def events_process() -> (Response, int):
    """
    Processes event payloads from Hasura
    :return Response:
    """
    incoming_token = request.headers.get("MOPED_API_APIKEY")
    incoming_event_name = request.headers.get("MOPED_API_EVENT_NAME", "")
    hashed_events_api = hashlib.md5()
    hashed_events_api.update(str(HASURA_EVENT_API).encode("utf-8"))
    hashed_incoming_token = hashlib.md5()
    hashed_incoming_token.update(str(incoming_token).encode("utf-8"))

    # Return error if token doesn't match
    if hashed_events_api.hexdigest() != hashed_incoming_token.hexdigest():
        return jsonify({
            "message": "Forbidden Request"
        }), 403
    else:
        print("We're good with the api key...")

    # Check if there is an event name provided, if not provide feedback.
    if incoming_event_name == "":
        return jsonify({
            "message": "Forbidden Request: Missing Event Name"
        }), 403
    else:
        print("We're good with the event name...")

    # We continue the execution 
    try:
        sqs = boto3.client("sqs")
        queue_url = (
            # The SQS url is a constant that follows this pattern:
            # https://sqs.us-east-1.amazonaws.com/{AWS_ACCOUNT_NUMBER}/{THE_QUEUE_NAME}
            HASURA_EVENTS_SQS_URL[0:48]  # This is the length of the url with the account number
            + "/atd-moped-events-"  # We're going to add a prefix pattern for our ATD VisionZero queues
            + f"{incoming_event_name}_{MOPED_API_CURRENT_ENVIRONMENT}".lower()  # And event name plus current environment
        )

        # Send message to SQS queue
        response = sqs.send_message(
            QueueUrl=queue_url,
            DelaySeconds=10,
            MessageBody=json.dumps(request.get_json(force=True)),
        )

        return jsonify({
            "message": "Update queued: " + str(response["MessageId"])
        }), 200

    except Exception as e:
        return jsonify({
            "message": "Unable to queue update request: " + str(e)
        }), 503
