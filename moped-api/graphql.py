import requests
from config import get_config
from requests import Response


def get_hasura_endpoint(alternative_conf=None) -> str:
    """
    Checks in alternative_conf for different endpoint for hasura,
    if not found then it returns whatever is the default, or raises exception.
    :param dict alternative_conf: A dictionary containing HASURA_HTTPS_ENDPOINT
    :return str: The Hasura HTTPS endpoint
    """
    if alternative_conf is None:
        alternative_conf = {}
    if "HASURA_HTTPS_ENDPOINT" in alternative_conf:
        hasura_http_endpoint = alternative_conf.get("HASURA_HTTPS_ENDPOINT", None)
    else:
        hasura_http_endpoint = get_config("HASURA_HTTPS_ENDPOINT")
    if hasura_http_endpoint is None:
        raise RuntimeError("Missing HASURA_HTTPS_ENDPOINT")
    return hasura_http_endpoint


def get_hasura_admin_secret(alternative_conf=None) -> str:
    """
    Checks in alternative_conf for the hasura admin keys, if not found then
    it returns whatever is the default, or raises exception.
    :param dict alternative_conf: A dictionary containing HASURA_ADMIN_SECRET
    :return str: The Hasura admin secret
    """
    if alternative_conf is None:
        alternative_conf = {}
    if "HASURA_ADMIN_SECRET" in alternative_conf:
        hasura_admin_secret = alternative_conf.get("HASURA_ADMIN_SECRET", None)
    else:
        hasura_admin_secret = get_config("HASURA_ADMIN_SECRET")
    if hasura_admin_secret is None:
        raise RuntimeError("Missing HASURA_ADMIN_SECRET")
    return hasura_admin_secret


def generate_hasura_headers(alternative_conf=None) -> dict:
    """
    Generates the HTTP headers for the GraphQL request
    :param dict alternative_conf: Alternative admin secret
    :return dict: The final HTTP headers
    """
    if alternative_conf is None:
        alternative_conf = {}
    return {
        "Accept": "*/*",
        "content-type": "application/json",
        "x-hasura-admin-secret": get_hasura_admin_secret(alternative_conf)
    }


def run_query(query: str, variables: dict, alternative_conf=None) -> Response:
    """
    Makes a request to the Hasura GraphQL endpoint
    :param str query: The GraphQL query to be executed
    :param dict variables: A dictionary with the variables to be provided to Hasura
    :param dict alternative_conf: An alternative configuration (optional)
    :return dict: The response from Hasura as a dictionary
    """
    if alternative_conf is None:
        alternative_conf = {}
    response = requests.post(
        url=get_hasura_endpoint(alternative_conf) + "/v1/graphql",
        headers=generate_hasura_headers(alternative_conf),
        json={
            "query": query,
            "variables": variables
        }
    )
    response.encoding = "utf-8"
    return response


def run_sql(query: str, alternative_conf=None) -> Response:
    """
    Makes a request to the Hasura GraphQL endpoint
    :param str query: The PostgreSQL query to be executed
    :param dict alternative_conf: An alternative configuration (optional)
    :return dict: The response from Hasura as a dictionary
    """
    if alternative_conf is None:
        alternative_conf = {}
    response = requests.post(
        url=get_hasura_endpoint(alternative_conf) + "/v1/query",
        headers=generate_hasura_headers(alternative_conf),
        json={
            "type": "run_sql",
            "args": {
                "sql": query
            }
        }
    )
    response.encoding = "utf-8"
    return response
