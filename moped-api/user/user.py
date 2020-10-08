import os, boto3
import botocore.exceptions
from flask import Blueprint, jsonify, abort
from flask_cognito import cognito_auth_required, current_cognito_jwt, request
from config import api_config

# Import our custom code
from claims import normalize_claims, get_claims
from user.helpers import load_claims, set_claims, is_valid_user, has_user_role

user_blueprint = Blueprint("user_blueprint", __name__)

MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")
USER_POOL = api_config[MOPED_API_CURRENT_ENVIRONMENT]["COGNITO_USERPOOL_ID"]
TABLE_NAME = api_config[MOPED_API_CURRENT_ENVIRONMENT]["DYNAMO_DB_TABLE_NAME"]

cognito_client = boto3.client("cognito-idp")
dynamo_db = boto3.resource("dynamodb")
user_table = dynamo_db.Table(TABLE_NAME)


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
    if is_valid_user(current_cognito_jwt):
        user_response = cognito_client.list_users(UserPoolId=USER_POOL)
        user_list = jsonify(user_response["Users"])
        return user_list
    else:
        abort(403)


@user_blueprint.route("/get_user/<id>")
@cognito_auth_required
def user_get_user(id):
    if is_valid_user(current_cognito_jwt):
        user_dict = {}

        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_roles = load_claims(id)

        user_dict.update(user_info)
        user_dict.update(user_roles)

        return user_dict
    else:
        abort(403)


@user_blueprint.route("/create_user", methods=["POST"])
@cognito_auth_required
@normalize_claims
def user_create_user(claims):
    if is_valid_user(current_cognito_jwt) and has_user_role("user", claims):

        try:
            json_data = request.json
            password = json_data["password"]
            # Provide email as username, if valid email, Cognito sets as email and generates UUID for username
            response = cognito_client.admin_create_user(
                UserPoolId=USER_POOL,
                Username=json_data["email"],
                TemporaryPassword=password,
            )
        except cognito_client.exceptions.UsernameExistsException as e:
            return jsonify(e.response)
        except cognito_client.exceptions.InvalidPasswordException as e:
            return jsonify(e.response)

        # Temporary password is valid, now make it permanent
        cognito_username = response["User"]["Username"]
        cognito_client.admin_set_user_password(
            UserPoolId=USER_POOL,
            Username=cognito_username,
            Password=password,
            Permanent=True,
        )

        # Encrypt and set encrypted Hasura metadata in DynamoDB
        user_claims = {
            "x-hasura-user-id": cognito_username,
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": json_data["roles"],
        }
        set_claims(cognito_username, user_claims)

        return jsonify(response)
    else:
        abort(403)


@user_blueprint.route("/update_user/<id>", methods=["PUT"])
@cognito_auth_required
@normalize_claims
def user_update_user(id):
    if is_valid_user(current_cognito_jwt) and has_user_role("admin", claims):
        return jsonify({"message": "Hello from update user! :)"})
    # Update user in AWS
    # return response
    else:
        abort(403)


@user_blueprint.route("/delete_user/<id>", methods=["DELETE"])
@cognito_auth_required
@normalize_claims
def user_delete_user(id, claims):
    if is_valid_user(current_cognito_jwt) and has_user_role("user", claims):
        response = cognito_client.admin_delete_user(UserPoolId=USER_POOL, Username=id)

        return response
    else:
        abort(403)
