import os, boto3
from flask import Blueprint, jsonify
from flask_cognito import cognito_auth_required, current_cognito_jwt
from config import api_config

# Import our custom code
from claims import normalize_claims, get_claims

user_blueprint = Blueprint("user_blueprint", __name__)

MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")
USER_POOL = api_config[MOPED_API_CURRENT_ENVIRONMENT]["COGNITO_USERPOOL_ID"]

is_valid_user = True

cognito_client = boto3.client("cognito-idp")


@user_blueprint.route("/")
def user_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    return jsonify({"message": "Hello from User! :)"})


@user_blueprint.route("/list_users")
@cognito_auth_required
def user_list_users():
    if is_valid_user:
        # Check if requester is admin and is a valid user
        response = cognito_client.list_users(UserPoolId=USER_POOL)
        return jsonify(response["Users"])
    else:
        abort(403)


@user_blueprint.route("/get_user/<id>")
@cognito_auth_required
def user_get_user(id):
    # Check if requester is admin and is a valid user
    if is_valid_user:
        response = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        return jsonify(response)
    else:
        abort(403)


@user_blueprint.route("/create_user", methods=["POST"])
@cognito_auth_required
def user_create_user():
    if is_valid_user:
        return jsonify({"message": "Hello from create users! :)"})
    # Check if requester is admin and is a valid user
    # Create user in AWS
    # return response
    else:
        abort(403)


@user_blueprint.route("/update_user/<id>", methods=["PUT"])
@cognito_auth_required
def user_update_user(id):
    if is_valid_user:
        return jsonify({"message": "Hello from update user! :)"})
    # Check if requester is admin and is a valid user
    # Update user in AWS
    # return response
    else:
        abort(403)


@user_blueprint.route("/delete_user/<id>", methods=["DELETE"])
@cognito_auth_required
def user_delete_user(id):
    if is_valid_user:
        return jsonify({"message": "Hello from delete user! :)"})
    # Check if requester is admin and is a valid user
    # Delete user in AWS
    # return response
    else:
        abort(403)
