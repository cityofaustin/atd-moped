from flask import Blueprint, jsonify
from flask_cognito import cognito_auth_required, current_cognito_jwt

# Import our custom code
from claims import normalize_claims, get_claims

admin_blueprint = Blueprint("admin_blueprint", __name__)


@admin_blueprint.route("/")
def admin_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    return jsonify({"message": "Hello from Admin! :)"})
