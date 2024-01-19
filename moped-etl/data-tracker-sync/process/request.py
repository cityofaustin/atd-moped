#
# Request Helper - Makes requests to a Hasura/GraphQL endpoint
#

import os
import requests

HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_SECRET = os.getenv("HASURA_ADMIN_SECRET")


def make_hasura_request(*, query, variables=None):
    """Fetch data from hasura

    Args:
        query (str): the hasura query

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    headers = {
        "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
        "content-type": "application/json",
    }
    payload = {"query": query, "variables": variables}
    res = requests.post(HASURA_ENDPOINT, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)
