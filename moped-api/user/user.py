import os, boto3
from botocore.exceptions import ClientError
from flask import Blueprint, jsonify, abort
from flask_cognito import cognito_auth_required, current_cognito_jwt, request
from config import api_config

# Import our custom code
from claims import normalize_claims, get_claims
from user.helpers import (
    load_claims,
    put_claims,
    format_claims,
    is_valid_user,
    has_user_role,
)

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
            email = json_data["email"]

            # Provide email as username, if valid email, Cognito generates UUID for username
            response = cognito_client.admin_create_user(
                UserPoolId=USER_POOL,
                Username=email,
                TemporaryPassword=password,
                UserAttributes=[
                    {"Name": "email", "Value": email},
                    {"Name": "email_verified", "Value": "true"},
                ],
            )

        except ClientError as e:
            if e.response["Error"]["Code"] == "UsernameExistsException":
                return jsonify(e.response)
            elif e.response["Error"]["Code"] == "InvalidPasswordException":
                return jsonify(e.response)
            else:
                return jsonify(e.response)

        # Temporary password is valid, now make it permanent
        cognito_username = response["User"]["Username"]
        cognito_client.admin_set_user_password(
            UserPoolId=USER_POOL,
            Username=cognito_username,
            Password=password,
            Permanent=True,
        )

        # Encrypt and set Hasura metadata in DynamoDB
        roles = json_data["roles"]
        user_claims = format_claims(cognito_username, roles)
        put_claims(cognito_username, user_claims)

        return jsonify(response)
    else:
        abort(403)


@user_blueprint.route("/update_user/<id>", methods=["PUT"])
@cognito_auth_required
@normalize_claims
def user_update_user(id, claims):
    if is_valid_user(current_cognito_jwt) and has_user_role("user", claims):
        json_data = request.json
        roles = json_data.get("roles", None)

        updated_attributes = []
        for name, value in json_data.items():
            if name != "roles":
                updated_attribute = {"Name": name, "Value": value}
                updated_attributes.append(updated_attribute)

        response = cognito_client.admin_update_user_attributes(
            UserPoolId=USER_POOL, Username=id, UserAttributes=updated_attributes,
        )

        if roles:
            user_claims = format_claims(id, roles)
            put_claims(id, user_claims)

        return jsonify(response)
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
