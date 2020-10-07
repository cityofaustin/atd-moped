import os, boto3
from flask import Blueprint, jsonify, abort
from flask_cognito import cognito_auth_required, current_cognito_jwt, request
from config import api_config
from user.helpers import load_claims, is_valid_user, has_user_role

# Import our custom code
from claims import normalize_claims, get_claims

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
        # TODO: Set how the user attributes will be formatted from the frontend
        # - provide email as username and Cognito sets as email and generates UUID for username
        #     [{
        #   "Name": "email",
        #   "Value": "<user email address>"
        # }]
        #         {
        #     "email": "<user email address>"
        # }
        json_data = request.json
        response = cognito_client.admin_create_user(
            UserPoolId=USER_POOL, Username=json_data["email"],
        )
        # TODO: Set temp password as permanent pass
        # TODO: Create user in Cognito
        # Encrypt and add Hasura metadata to DynamoDB
        # {
        # "x-hasura-default-role": "user",
        # "x-hasura-allowed-roles": ["user"],
        # }
        # return response
        return jsonify(response)
    else:
        abort(403)


# @user_blueprint.route("/update_user/<id>", methods=["PUT"])
# @cognito_auth_required
# def user_update_user(id):
#     if is_valid_user(current_cognito_jwt) and has_user_role("admin", claims):
#         return jsonify({"message": "Hello from update user! :)"})
#     # Update user in AWS
#     # return response
#     else:
#         abort(403)


# @user_blueprint.route("/delete_user/<id>", methods=["DELETE"])
# @cognito_auth_required
# def user_delete_user(id):
#     if is_valid_user(current_cognito_jwt) and has_user_role("admin", claims):
#         return jsonify({"message": "Hello from delete user! :)"})
#     # Delete user in AWS
#     # return response
#     else:
#         abort(403)
