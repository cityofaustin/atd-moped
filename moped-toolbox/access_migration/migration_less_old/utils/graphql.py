import requests
from requests import Response
from secrets import HASURA_AUTH


def make_hasura_request(*, query, variables, env="local"):
    """Post a query or mutation to Hasura

    Args:
        query (str): the hasura query
        env (str): the environment name - 'local', 'staging', or 'prod'

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    admin_secret = HASURA_AUTH["hasura_graphql_admin_secret"][env]
    endpoint = HASURA_AUTH["hasura_graphql_endpoint"][env]
    headers = {
        "X-Hasura-Admin-Secret": admin_secret,
        "content-type": "application/json",
    }
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)



def run_sql(query: str) -> Response:
    """
    Makes a request to the Hasura GraphQL endpoint
    :param str query: The PostgreSQL query to be executed
    :return dict: The response from Hasura as a dictionary
    """

    response = requests.post(
        url="http://localhost:8080/v1/query",
        headers={
            "Accept": "*/*",
            "content-type": "application/json",
            # "x-hasura-admin-secret": HERE_GOES_THE_SECRET
        },
        json={
            "type": "run_sql",
            "args": {
                "sql": query
            }
        }
    )
    response.encoding = "utf-8"
    return response
