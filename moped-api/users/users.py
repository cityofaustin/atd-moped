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
    get_user_database_ids,
    is_valid_user_password,
    is_users_password,
    is_valid_user_profile,
    is_valid_uuid,
    db_create_user,
    db_update_user,
    db_deactivate_user,
    db_user_exists,
    cognito_user_exists,
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

        # Gather if profile is valid and any feedback
        profile_valid, profile_error_feedback = is_valid_user_profile(
            user_profile=request.json
        )

        # Check if the profile is valid, if not return error
        if not profile_valid:
            return jsonify({"error": profile_error_feedback}), 400

        # Gather the existing user list
        user_list_response = cognito_client.list_users(UserPoolId=USER_POOL)

        json_data = request.json
        password = json_data["password"]
        email = json_data["email"]
        cognito_response = {"message": "User already existing in Cognito"}

        # Determine if the user already exists
        user_already_exists, user_cognito_uuid = cognito_user_exists(
            user_list_response=user_list_response,
            user_email=email,
        )

        # Try creating account
        try:
            # If the user does not exist, then create the account
            if user_already_exists == False:

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
                # Then  we must set the user password
                cognito_username = cognito_response["User"]["Username"]
                cognito_client.admin_set_user_password(
                    UserPoolId=USER_POOL,
                    Username=cognito_username,
                    Password=password,
                    Permanent=True,
                )
                # Copy the username to the UUID variable
                user_cognito_uuid = cognito_username

            # The account already exists in Cognito, skip this step
        except ClientError as e:
            if e.response["Error"]["Code"] == "UsernameExistsException":
                return jsonify(e.response), 400  # Bad request
            elif e.response["Error"]["Code"] == "InvalidPasswordException":
                return jsonify(e.response), 400  # Bad request
            else:
                return jsonify(e.response), 400  # Internal Server Error

        # Generate the user profile for the database
        user_profile = generate_user_profile(
            cognito_id=user_cognito_uuid, json_data=request.json
        )

        # Persist the profile in the database
        db_response = db_create_user(user_profile=user_profile)

        if "errors" in db_response:
            final_response = {
                "error": {
                    "message": "Errors reported",
                    "cognito": cognito_response,
                    "database": db_response,
                }
            }
            return jsonify(final_response), 400

        # Encrypt and set Hasura metadata in DynamoDB
        roles = json_data["roles"]

        # Retrieve database id values as strings
        database_id, workgroup_id = get_user_database_ids(response=db_response)

        user_claims = format_claims(
            user_id=user_cognito_uuid,
            roles=roles,
            database_id=database_id,
            workgroup_id=workgroup_id,
        )
        # Write database_id in django
        put_claims(
            user_email=email,
            user_claims=user_claims,
            cognito_uuid=user_cognito_uuid,
            database_id=database_id,
            workgroup_id=workgroup_id,
        )

        try:
            del db_response["data"]["insert_moped_users"]["returning"]
        except (TypeError, KeyError):
            db_response = {
                "message": "Success, but returning data could not be deleted"
            }

        final_response = {
            "success": {
                "message": f"New user created: {user_cognito_uuid}",
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

        # Remove date_added, if provided, so we don't reset this field
        request.json.pop("date_added", None)
        status_id = request.json.get("status_id", 0)
        email = request.json.get("email", None)
        password = request.json.get("password", None)
        reactivate_account = False

        # Check if there is email provided
        if email is None:
            return jsonify({"error": {"message": "No email provided"}}), 400

        profile_valid, profile_error_feedback = is_valid_user_profile(
            user_profile=request.json, ignore_fields=["password"]
        )

        if not profile_valid:
            return jsonify({"error": profile_error_feedback}), 400

        # The status is active, check if the user exists
        if status_id == 1:
            try:
                cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
                user_already_exists = True
            except ClientError as e:
                user_already_exists = False
        # If the user doesn't exist and is now active, create it...
        if user_already_exists == False and status_id == 1:
            # Check if the password needs to be provided
            if password is None or password == "":
                return jsonify({"error": {"message": "No password provided."}}), 400

            # If we have all we need, then we proceed
            try:
                cognito_response = cognito_client.admin_create_user(
                    UserPoolId=USER_POOL,
                    Username=email,
                    TemporaryPassword=password,
                    UserAttributes=[
                        {"Name": "email", "Value": email},
                        {"Name": "email_verified", "Value": "true"},
                    ],
                )
                # Then  we must set the user password
                cognito_username = cognito_response["User"]["Username"]
                cognito_client.admin_set_user_password(
                    UserPoolId=USER_POOL,
                    Username=cognito_username,
                    Password=password,
                    Permanent=True,
                )
                # Copy the username to the UUID variable
                user_cognito_uuid = cognito_username
                id = cognito_username
                reactivate_account = True
            except ClientError as e:
                return jsonify(e.response), 400  # Bad request

        # Retrieve current profile (to fetch old email)
        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_email_before_update = get_user_email_from_attr(user_attr=user_info)

        json_data = request.json
        roles = json_data.get("roles", None)

        user_profile = generate_user_profile(cognito_id=id, json_data=request.json)

        db_response = db_update_user(
            user_profile=user_profile, search_by_email=reactivate_account
        )

        if "errors" in db_response:
            response = {
                "error": {
                    "message": f"Cannot update user {id}",
                    "database": db_response,
                }
            }
            return jsonify(response), 400

        # Check we received a database_id and workgroup_id from database
        database_id, workgroup_id = get_user_database_ids(response=db_response)

        if database_id == "0" or workgroup_id == "0":
            response = {
                "error": {
                    "message": f"Cannot update user, invalid database id or workgroup id.",
                    "database": db_response,
                }
            }
            return jsonify(response), 400

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
            user_claims = format_claims(
                user_id=id,
                roles=roles,
                database_id=database_id,
                workgroup_id=workgroup_id,
            )

            put_claims(
                user_email=user_profile["email"],
                user_claims=user_claims,
                cognito_uuid=id,
                database_id=database_id,
                workgroup_id=workgroup_id,
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
    Returns deleted user details
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
            return jsonify(response), 400

        user_info = cognito_client.admin_get_user(UserPoolId=USER_POOL, Username=id)
        user_email = get_user_email_from_attr(user_attr=user_info)

        # Delete the cognito instance
        cognito_response = cognito_client.admin_delete_user(
            UserPoolId=USER_POOL, Username=id
        )

        # Delete sso access, if the account exists
        if str(user_email).lower().endswith("@austintexas.gov"):
            try:
                cognito_response_sso = cognito_client.admin_delete_user(
                    UserPoolId=USER_POOL, Username=f"azuread_{user_email}"
                )
            except ClientError as e:
                cognito_response_sso = {
                    "success": f"azure account email not found, skipping",
                    "message": str(e),
                }
        else:
            cognito_response_sso = {
                "success": "sso deletion skipped, user not government"
            }

        # Now delete the claims in DynamoDB
        delete_claims(user_email=user_email)

        response = {
            "success": {
                "message": f"User deleted: {id}",
                "cognito": cognito_response,
                "cognito_sso": cognito_response_sso,
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
    Returns updated password details
    :return Response, int:
    """
    if is_valid_user(current_cognito_jwt) and is_users_password(
        current_cognito_jwt, id
    ):
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
                return jsonify(e.response), 400  # Internal Server Error

        response = {
            "success": {
                "message": f"User password updated: {id}",
                "cognito": cognito_response,
            }
        }

        return jsonify(response)
    else:
        abort(403)
