import json
import time
import logging
import urllib.request

from jose import jwk, jwt
from jose.utils import base64url_decode

from config import (
    ATD_JWK_KEYS,
    AWS_ATD_APP_CLIENT_ID
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def verify_jwt_token(token: str) -> (bool, dict):
    """
    Verifies the JWT signature against the JWK
    :param str token: The token being evaluated
    :return tuple:
    """
    # Straight away, if the token is not a string return false.
    if not isinstance(token, str):
        return False, {}
    
    # get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(ATD_JWK_KEYS)):
        if kid == ATD_JWK_KEYS[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        logger.error("Public key not found in jwks.json")
        return False

    # construct the public key
    public_key = jwk.construct(ATD_JWK_KEYS[key_index])
    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)
    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        logger.error("Signature verification failed")
        return False

    logger.info("Signature successfully verified")
    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    # additionally we can verify the token expiration
    if time.time() > claims["exp"]:
        logger.error("Token is expired")
        return False
    # and the Audience  (use claims['client_id'] if verifying an access token)
    if claims["aud"] != AWS_ATD_APP_CLIENT_ID:
        logger.error("Token was not issued for this audience")
        return False

    # It appears all checks have passed
    return True, claims
