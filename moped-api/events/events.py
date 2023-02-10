import datetime
from flask import Blueprint, jsonify


events_blueprint = Blueprint('events_blueprint', __name__)

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
