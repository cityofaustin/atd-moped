from flask import Blueprint, jsonify
from flask_cognito import cognito_auth_required, current_cognito_jwt

# Import our custom code
from claims import normalize_claims, get_claims

user_blueprint = Blueprint("user_blueprint", __name__)


@user_blueprint.route("/")
def user_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    return jsonify({"message": "Hello from User! :)"})

@user_blueprint.route("/list_users")
def user_list_users():
    # Check if requester is admin and is a valid user
    # Fetch list of users from AWS
    # return response
    else:
        abort(403)

@user_blueprint.route("/user/get_user/<id>")
def user_get_user(id):
    # Check if requester is admin and is a valid user
    # Fetch user from AWS
    # return response
    else:
        abort(403)

@user_blueprint.route("/user/create_user", methods=["POST"])
def user_create_user():
    # Check if requester is admin and is a valid user
    # Create user in AWS
    # return response
    else:
        abort(403)

@user_blueprint.route("/user/update_user/<id>", methods=["PUT"])
def user_update_user(id):
    # Check if requester is admin and is a valid user
    # Update user in AWS
    # return response
    else:
        abort(403)

@user_blueprint.route("/user/delete_user/<id>", methods=["DELETE"])
def user_delete_user(id):
    # Check if requester is admin and is a valid user
    # Delete user in AWS
    # return response
    else:
        abort(403)