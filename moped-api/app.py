import os, datetime
from flask import Flask, jsonify, Response
from flask_cognito import CognitoAuth
from flask_cors import CORS
from config import api_config

MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")

#
# Import Blueprints
#
from auth.auth import auth_blueprint
from users.users import users_blueprint

app = Flask(__name__)

#
# Register Blueprints
#
app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(users_blueprint, url_prefix="/users")

#
# Cognito
#
app.config.update(api_config[MOPED_API_CURRENT_ENVIRONMENT])
cognito = CognitoAuth(app)

#
# CORS Policy
#   Eventually we will want to close the CORS policy to
# only our own domains. For now it can be open since
# it requires authentication.
#
cors = CORS(app)


#
# This should be just a health-check
#
@app.route("/")
def app_index() -> Response:
    """
    Generates a simple health-check message.
    :return str:
    """
    now = datetime.datetime.now()
    return jsonify(
        {
            "message": "MOPED API Available - Health Check - Available @ %s"
            % now.strftime("%Y-%m-%d %H:%M:%S")
        }
    )

