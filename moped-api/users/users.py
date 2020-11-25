import boto3

from botocore.exceptions import ClientError
from flask import Blueprint, jsonify, abort, Response
from flask_cognito import cognito_auth_required, current_cognito_jwt, request
from config import api_config

# Import our custom code
from claims import *

from users.helpers import (
    generate_user_profile,
    generate_cognito_attributes,
    get_user_email_from_attr,
    is_valid_user_password,
    is_valid_user_profile,
    is_valid_uuid,
    db_create_user,
    db_update_user,
    db_deactivate_user,
)

users_blueprint = Blueprint("users_blueprint", __name__)

USER_POOL = api_config["COGNITO_USERPOOL_ID"]


@users_blueprint.route("/", methods=["GET"])
@cognito_auth_required
def user_list_users() -> (Response, int):
    """
    Returns users in user pool
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt):
        cognito_client = boto3.client("cognito-idp")

        user_response = cognito_client.list_users(UserPoolId=USER_POOL)
        user_list = list(
            filter(
                lambda user: "azuread_" not in user["Username"], user_response["Users"]
            )
        )
        return jsonify(user_list)
    else:
        abort(403)


@users_blueprint.route("/<id>", methods=["GET"])
@cognito_auth_required
def user_get_user(id: str) -> (Response, int):
    """
    Returns user details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt):
        cognito_client = boto3.client("cognito-idp")

        user_dict = {}

        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_email = get_user_email_from_attr(user_attr=user_info)
        user_roles = load_claims(user_email=user_email)
        user_dict.update(user_info)
        user_dict.update(user_roles)

        return jsonify(user_dict)
    else:
        abort(403)


@users_blueprint.route("/", methods=["POST"])
@cognito_auth_required
@normalize_claims
def user_create_user(claims: list) -> (Response, int):
    """
    Returns created user details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt) and has_user_role("moped-admin", claims):
        cognito_client = boto3.client("cognito-idp")

        profile_valid, profile_error_feedback = is_valid_user_profile(
            user_profile=request.json
        )

        if not profile_valid:
            return jsonify({"error": profile_error_feedback}), 400

        try:
            json_data = request.json
            password = json_data["password"]
            email = json_data["email"]

            # Provide email as username, if valid email, Cognito generates UUID for username
            cognito_response = cognito_client.admin_create_user(
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
                return jsonify(e.response), 400  # Bad request
            elif e.response["Error"]["Code"] == "InvalidPasswordException":
                return jsonify(e.response), 400  # Bad request
            else:
                return jsonify(e.response), 500  # Internal Server Error

        # Temporary password is valid, now make it permanent
        cognito_username = cognito_response["User"]["Username"]
        cognito_client.admin_set_user_password(
            UserPoolId=USER_POOL,
            Username=cognito_username,
            Password=password,
            Permanent=True,
        )

        # Encrypt and set Hasura metadata in DynamoDB
        roles = json_data["roles"]
        user_claims = format_claims(cognito_username, roles)
        put_claims(
            user_email=email, user_claims=user_claims, cognito_uuid=cognito_username
        )

        # Generate the user profile for the database
        user_profile = generate_user_profile(
            cognito_id=cognito_username, json_data=request.json
        )
        # Persist the profile in the database
        db_response = db_create_user(user_profile=user_profile)

        if "errors" in db_response:
            cognito_response = cognito_client.admin_delete_user(
                UserPoolId=USER_POOL, Username=cognito_username
            )
            final_response = {
                "error": {
                    "message": "Error in the database, user deleted from cognito",
                    "cognito": cognito_response,
                    "database": db_response,
                }
            }
            return jsonify(final_response), 500

        final_response = {
            "success": {
                "message": f"New user created: {cognito_username}",
                "cognito": cognito_response,
                "database": db_response,
            }
        }
        return jsonify(final_response)
    else:
        abort(403)


@users_blueprint.route("/<id>", methods=["PUT"])
@cognito_auth_required
@normalize_claims
def user_update_user(id: str, claims: list) -> (Response, int):
    """
    Returns updated user details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt) and has_user_role("moped-admin", claims):
        cognito_client = boto3.client("cognito-idp")

        profile_valid, profile_error_feedback = is_valid_user_profile(
            user_profile=request.json
        )

        if not profile_valid:
            return jsonify({"error": profile_error_feedback}), 400

        # Retrieve current profile (to fetch old email)
        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_email_before_update = get_user_email_from_attr(user_attr=user_info)

        json_data = request.json
        roles = json_data.get("roles", None)

        user_profile = generate_user_profile(cognito_id=id, json_data=request.json)

        db_response = db_update_user(user_profile=user_profile)

        if "errors" in db_response:
            response = {
                "error": {
                    "message": f"Cannot update user {id}",
                    "database": db_response,
                }
            }
            return jsonify(response), 500

        updated_attributes = generate_cognito_attributes(user_profile=json_data)

        cognito_response = cognito_client.admin_update_user_attributes(
            UserPoolId=USER_POOL,
            Username=id,
            UserAttributes=updated_attributes,
        )

        # Delete the email if it is different
        if user_email_before_update != json_data["email"]:
            delete_claims(user_email=user_email_before_update)

        if roles:
            user_claims = format_claims(id, roles)
            put_claims(
                user_email=user_profile["email"],
                user_claims=user_claims,
                cognito_uuid=id,
            )

        response = {
            "success": {
                "message": f"User updated: {id}",
                "cognito": cognito_response,
                "database": db_response,
            }
        }

        return jsonify(response)
    else:
        abort(403)


@users_blueprint.route("/<id>", methods=["DELETE"])
@cognito_auth_required
@normalize_claims
def user_delete_user(id: str, claims: list) -> (Response, int):
    """
    Returns created user details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt) and has_user_role("moped-admin", claims):
        cognito_client = boto3.client("cognito-idp")

        db_response = db_deactivate_user(user_cognito_id=id)
        if "errors" in db_response:
            response = {
                "error": {
                    "message": f"Cannot deactivate user {id}",
                    "database": db_response,
                }
            }
            return jsonify(response), 500

        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_email = get_user_email_from_attr(user_attr=user_info)

        cognito_response = cognito_client.admin_delete_user(
            UserPoolId=USER_POOL, Username=id
        )
        delete_claims(user_email=user_email)

        response = {
            "success": {
                "message": f"User deleted: {id}",
                "cognito": cognito_response,
                "database": db_response,
            }
        }
        return jsonify(response)
    else:
        abort(403)


@users_blueprint.route("/<id>/password", methods=["PUT"])
@cognito_auth_required
@normalize_claims
def user_update_password(id: str, claims: list) -> (Response, int):
    """
    Returns created user details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt) and has_user_role("moped-admin", claims):
        cognito_client = boto3.client("cognito-idp")

        password_valid, password_error_feedback = is_valid_user_password(
            password=request.json
        )

        if not password_valid:
            return jsonify({"error": password_error_feedback}), 400

        try:
            json_data = request.json
            password = json_data["password"]

            cognito_response = cognito_client.admin_set_user_password(
                UserPoolId=USER_POOL, Username=id, Password=password, Permanent=True
            )

        except ClientError as e:
            if e.response["Error"]["Code"] == "InvalidPasswordException":
                return jsonify(e.response), 400  # Bad request
            else:
                return jsonify(e.response), 500  # Internal Server Error

        response = {
            "success": {
                "message": f"User password updated: {id}",
                "cognito": cognito_response,
            }
        }

        return jsonify(response)
    else:
        abort(403)