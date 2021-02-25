import datetime, boto3, os

from flask import Blueprint, jsonify, request, redirect
from flask_cognito import cognito_auth_required, current_cognito_jwt

files_blueprint = Blueprint("auth_blueprint", __name__)
aws_s3_client = boto3.client("s3", region_name=os.getenv("DEFALUT_REGION"))
aws_bucket_name = os.getenv("S3_UPLOADS_BUCKET", None)

from helpers import (
    get_file_extension,
    get_file_name,
    generate_clean_filename,
    is_valid_unique_id,
    get_current_datetime,
    filename_timestamp,
    generate_random_hash,
)


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
def files_request_signature() -> dict:
    """
    Requests permission to upload a file directly to S3.
    If the request is valid, the response includes a temporary token.
    :return:
    """
    # First, we need to retrieve the name of the file to be uploaded
    filename = request.args.get("file")
    # Do we need to validate the file name? via regex?
    # Do we care about the file name at all?
    # Should the file name be hashed? Probably not
    # Maybe not even require the file name, just a file extension?

    # Generate unique file name
    random_hash = generate_random_hash()
    file_new_unique_name = generate_clean_filename(filename)
    file_s3_key = f"uploads/user_db_id/{file_new_unique_name}"

    post = aws_s3_client.generate_presigned_post(
        Bucket=aws_bucket_name, Key=file_s3_key
    )

    return jsonify(
        {
            "status": "success",
            "message": "permission granted",
            "uuid": random_hash,
            "filename": filename,
            "credentials": post,
        }
    )


# Downloads a file from S3
@files_blueprint.route("/download/<path:path>", methods=("GET",))
def file_download(path) -> redirect:
    url = aws_s3_client.generate_presigned_url(
        ExpiresIn=60,  # seconds
        ClientMethod="get_object",
        Params={"Bucket": aws_bucket_name, "Key": path},
    )

    return redirect(url, code=302)
