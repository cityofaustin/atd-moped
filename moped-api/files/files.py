import datetime, boto3, os, json

from flask import Blueprint, jsonify, request, redirect
from flask_cognito import cognito_auth_required, current_cognito_jwt

from claims import *

from files.helpers import (
    generate_clean_filename,
    generate_random_hash,
    is_valid_filename,
    is_valid_number,
    get_user_id,
)

MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")
MOPED_API_UPLOADS_S3_BUCKET = os.getenv("MOPED_API_UPLOADS_S3_BUCKET", None)

files_blueprint = Blueprint("files_blueprint", __name__)
aws_s3_client = boto3.client("s3", region_name=os.getenv("DEFALUT_REGION"))


def is_user_authorized(session_token: dict, claims: dict) -> tuple:
    """
    Checks the user's has a valid token, and that the user db id is present,
    and that the role is either and admin or an editor.
    :param dict session_token: The token being validated
    :param dict claims: The claims being validated
    :return tuple:
    """
    # If not a valid user, then stop session...
    if not is_valid_user(session_token):
        return False, "Not Authorized"

    # If not a valid user, then stop session...
    if not is_valid_number(get_user_id(claims)):
        return False, "Not Authorized: Invalid Database User ID"

    # Make sure the user is either an editor or an admin
    if not has_user_role("moped-admin", claims) and not has_user_role("moped-editor", claims):
        return False, "Not authorized: Insufficient access"

    return True, "Authorized"


@files_blueprint.route("/")
def auth_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    now = datetime.datetime.now()
    return jsonify(
        {
            "message": "MOPED API Available - Files - Health Check - Available @ %s"
            % now.strftime("%Y-%m-%d %H:%M:%S")
        }
    )


#
# In order to retrieve the current_cognito_jwt object,
# we need to call the @cognito_auth_required decorator.
#
@files_blueprint.route("/request-signature", methods=("GET",))
@cognito_auth_required
@normalize_claims
def files_request_signature(claims: list) -> dict:
    """
    Requests permission to upload a file directly to S3.
    If the request is valid, the response includes a temporary token.
    :return:
    """
    # Check the user is authorized
    user_authorized, auth_message = is_user_authorized(
        session_token=current_cognito_jwt,
        claims=claims
    )

    # Stop the request if there is an issue with the user credentials
    if not user_authorized:
        return jsonify({"status": "error", "message": auth_message}), 403

    # Load the user id from session
    user_id = get_user_id(claims)

    #
    # Retrieve Parameters:
    #
    filename = request.args.get("file")
    project_id = request.args.get("project_id", "0")
    upload_type = request.args.get("type", "private")

    # Check our parameters
    if not is_valid_filename(filename):
        return jsonify({"status": "error", "message": "Invalid file name"}), 403

    # Determine upload type
    if upload_type not in ["private", "public"]:
        upload_type = "private"

    # Determine the principal: project or user
    if is_valid_number(project_id) and project_id != "0":
        upload_principal = "project"
    else:
        upload_principal = "user"

    # Generate unique file name
    random_hash = generate_random_hash()
    file_new_unique_name = generate_clean_filename(filename)

    # Final Unique File Name:
    if upload_principal == "project":
        file_s3_key = f"{upload_type}/{upload_principal}/{project_id}/{user_id}_{file_new_unique_name}"
    else:
        file_s3_key = f"{upload_type}/{upload_principal}/{user_id}/{file_new_unique_name}"

    # Generate upload credentials
    credentials = aws_s3_client.generate_presigned_post(
        Bucket=MOPED_API_UPLOADS_S3_BUCKET, Key=file_s3_key
    )

    # Check for errors (not yet implemented)

    return jsonify(
        {
            "status": "success",
            "message": "permission granted",
            "uuid": random_hash,
            "filename": file_s3_key,
            "credentials": credentials,
        }
    )


# Downloads a file from S3
@files_blueprint.route("/download/<path:path>", methods=("GET",))
@cognito_auth_required
def file_download(path) -> redirect:
    """
    Retrieves a download file url for the user
    :param str path: The file name
    :param list claims: The claims as loaded from the JWT token
    :return redirect:
    """
    if not is_valid_user(current_cognito_jwt):
        jsonify({"status": "error", "message": "Not authorized"}), 403

    url = aws_s3_client.generate_presigned_url(
        ExpiresIn=60,  # seconds
        ClientMethod="get_object",
        Params={"Bucket": MOPED_API_UPLOADS_S3_BUCKET, "Key": path},
    )

    return jsonify({
        "status": "sucess",
        "message": "success",
        "download_url": url
    })
