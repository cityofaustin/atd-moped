import json
from flask_cognito import _request_ctx_stack, current_cognito_jwt
from functools import wraps
from werkzeug.local import LocalProxy

from typing import Callable

#
# LocalProxy is a funny class in werkzeug.local, it seems to be a way
# to safely manage global variables (thread locals) with concurrency
# safety. A LocalProxy seems to behave as a pointer to global variable.
#
current_hasura_claims = LocalProxy(
    lambda: {}
    if hasattr(_request_ctx_stack.top, "hasura_claims") is False
    else getattr(_request_ctx_stack.top, "hasura_claims", None)
)


def get_claims(payload: LocalProxy) -> dict:
    """
    It's a handy way to extract the hasura claims from a valid payload.
    :param LocalProxy payload:
    :return dict:
    """
    cognito_jwt_dict = payload._get_current_object()
    return json.loads(cognito_jwt_dict["https://hasura.io/jwt/claims"])


def resolve_hasura_claims(func: Callable) -> Callable:
    """
    This is a function to implement a decorator that allows us to have
    access to a Local called hasura_claims, similar to current_cognito_jwt.
    :param Callable func: The function to be wrapped
    :return Callable: The wrapper function
    """

    def wrapper(*args, **kwargs):
        print("resolve_hasura_claims: start")
        cognito_jwt_dict = current_cognito_jwt._get_current_object()
        _request_ctx_stack.top.hasura_claims = json.loads(
            cognito_jwt_dict["https://hasura.io/jwt/claims"]
        )
        return func(*args, **kwargs)

    return wrapper


def normalize_claims(func: Callable) -> Callable:
    """
    Implements a decorator that parses the contents of the hasura claims
    and transforms it from string to a dictionary.
    :param Callable func: The function to be wrapped
    :return Callable: The wrapper function
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        print("resolve_hasura_claims: start")
        claims = current_cognito_jwt._get_current_object()
        claims["https://hasura.io/jwt/claims"] = json.loads(
            claims["https://hasura.io/jwt/claims"]
        )
        return func(claims=claims, *args, **kwargs)

    return wrapper
