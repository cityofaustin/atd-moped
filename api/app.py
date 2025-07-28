import os, datetime
from flask import Flask, jsonify, Response
from flask_cognito import CognitoAuth
from flask_cors import CORS

from config import api_config


MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")
print(f"APP.PY: MOPED_API_CURRENT_ENVIRONMENT = {MOPED_API_CURRENT_ENVIRONMENT}")

from auth.auth import auth_blueprint
from users.users import users_blueprint
from files.files import files_blueprint

print("APP.PY: Successfully imported all blueprints")


print("APP.PY: Creating Flask app instance...")
app = Flask(__name__)
print("APP.PY: Flask app created")


print("APP.PY: Registering blueprints...")
try:
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.register_blueprint(files_blueprint, url_prefix="/files")
    print("APP.PY: Successfully registered all blueprints")
except Exception as e:
    print(f"APP.PY: ERROR registering blueprints: {type(e).__name__}: {str(e)}")
    import traceback

    traceback.print_exc()
    raise


print("APP.PY: Configuring Cognito...")
try:
    app.config.update(api_config)
    print(f"APP.PY: Updated app config with api_config (keys: {len(api_config)} items)")
    cognito = CognitoAuth(app)
    print("APP.PY: CognitoAuth initialized")
except Exception as e:
    print(f"APP.PY: ERROR configuring Cognito: {type(e).__name__}: {str(e)}")
    import traceback

    traceback.print_exc()
    raise

#
# CORS Policy
#   Eventually we will want to close the CORS policy to
# only our own domains. For now it can be open since
# it requires authentication.
#
print("APP.PY: Configuring CORS...")
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


# Add a main block to run the app if executed directly
if __name__ == "__main__":
    print("APP.PY: Running Flask app in main block...")
    try:
        # Check if we're in development mode
        flask_env = os.getenv("FLASK_ENV", "production")
        print(f"APP.PY: FLASK_ENV = {flask_env}")

        # Get port from environment or default to 5000
        port = int(os.getenv("PORT", "5000"))
        print(f"APP.PY: PORT = {port}")

        # Check for debug mode
        debug_mode = flask_env == "development"
        print(f"APP.PY: Debug mode = {debug_mode}")

        print("APP.PY: Starting Flask server...")
        app.run(host="0.0.0.0", port=port, debug=debug_mode)
    except Exception as e:
        print(f"APP.PY: ERROR running Flask app: {type(e).__name__}: {str(e)}")
        import traceback

        traceback.print_exc()
        # Exit with error code
        import sys

        sys.exit(1)
