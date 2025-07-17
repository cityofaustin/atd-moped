import datetime
from flask import Blueprint, jsonify
from flask_cognito import cognito_auth_required, current_cognito_jwt

try:
    from claims import normalize_claims, get_claims
except Exception as e:
    print(f"AUTH/AUTH.PY: ERROR importing claims: {type(e).__name__}: {str(e)}")
    import traceback

    traceback.print_exc()
    raise

auth_blueprint = Blueprint("auth_blueprint", __name__)


@auth_blueprint.route("/")
def auth_index() -> str:
    """
    Returns a simple message.
    :return str:
    """
    now = datetime.datetime.now()
    return jsonify(
        {
            "message": "MOPED API Available - Auth - Health Check - Available @ %s"
            % now.strftime("%Y-%m-%d %H:%M:%S")
        }
    )


#
# In order to retrieve the current_cognito_jwt object,
# we need to call the @cognito_auth_required decorator.
#
@auth_blueprint.route("/current_user")
@cognito_auth_required
def auth_current_user() -> str:
    """
    Shows the current user payload data
    :return str:
    """

    # With Cognito + Hasura, claims are a stringified json string
    #   https://hasura.io/docs/1.0/graphql/core/guides/integrations/aws-cognito.html#configure-hasura-to-use-cognito-keys
    hasura_claims = get_claims(current_cognito_jwt)

    return jsonify(
        {
            "cognito:username": current_cognito_jwt["cognito:username"],
            "email": current_cognito_jwt["email"],
            "hasura_claims": hasura_claims,
            "decrypted_jwt": current_cognito_jwt._get_current_object(),
        }
    )


#
# You may also use the normalize_claims decorator
# along with the claims parameter to have a fully parsed claims dict
#
@auth_blueprint.route("/current_user2")
@cognito_auth_required
@normalize_claims
def auth_current_user2(claims) -> str:
    """
    Shows the current user payload data
    :return str:
    """
    return jsonify(
        {
            "cognito:username": claims["cognito:username"],
            "email": claims["email"],
            "hasura_claims": claims["https://hasura.io/jwt/claims"],
        }
    )
