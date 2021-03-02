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

    # If not a valid user, then stop session...
    if not is_valid_user(current_cognito_jwt):
        jsonify({"status": "error", "message": "Not authorized"}), 403

    # Load the user id from session
    user_id = get_user_id(claims)

    # If not a valid user, then stop session...
    if not is_valid_number(user_id):
        return jsonify({"status": "error", "message": "Not authorized"})

    # Retrieve parameters:
    filename = request.args.get("file")
    upload_type = request.args.get("type")
    project_id = request.args.get("project_id")

    if upload_type not in ["user", "project"]:
        return jsonify({"status": "error", "message": "Invalid upload type"}), 403

    if upload_type == "user":
        project_id = "0"

    # Check our parameters
    if not is_valid_number(project_id) or not is_valid_filename(filename):
        return jsonify({"status": "error", "message": "Invalid parameters"}), 403

    #
    # We have the basic requirements...
    #
    print("User Claims: ")
    print(json.dumps(claims))

    # Generate unique file name
    random_hash = generate_random_hash()
    file_new_unique_name = generate_clean_filename(filename)

    # Final Unique File Name:
    file_s3_key = f"uploads/{project_id}/{user_id}_{file_new_unique_name}"
    import pdb

    pdb.set_trace()

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
@normalize_claims
def file_download(path, claims: list) -> redirect:
    """
    Retrieves a download file url for the user
    :param str path: The file name
    :param list claims: The claims as loaded from the JWT token
    :return redirect:
    """
    if not is_valid_user(current_cognito_jwt):
        jsonify({"status": "error", "message": "not authorized"}), 403

    url = aws_s3_client.generate_presigned_url(
        ExpiresIn=60,  # seconds
        ClientMethod="get_object",
        Params={"Bucket": MOPED_API_UPLOADS_S3_BUCKET, "Key": path},
    )

    return redirect(url, code=302)
