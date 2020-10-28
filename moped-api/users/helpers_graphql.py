"""
Helper methods to update the database via GraphQL
"""
from graphql import run_query

from users.helpers_graphql_queries import (
    GRAPHQL_CRATE_USER,
    GRAPHQL_UPDATE_USER,
    GRAPHQL_DEACTIVATE_USER
)

"""
User dictionary example:
    user = {
        "cognito_user_id": "",
        "date_added": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "is_coa_staff": True,
        "status_id": 1,
        "title": "",
        "workgroup": "ATD",
        "workgroup_id": 1,
    }
"""


def create_user(user: dict) -> dict:
    """
    Creates a user in the database via GraphQL
    :param dict user: The user details
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_CRATE_USER,
        variables={
            "users": [user]
        }
    )
    return response.json()


def update_user(user: dict) -> dict:
    """
    Updates a user in the database via GraphQL
    :param dict user: The user details
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_UPDATE_USER,
        variables={
          "userBoolExp": {
            "cognito_user_id": {
              "_eq": user["cognito_user_id"]
            }
          },
          "user": user
        }
    )
    return response.json()


def deactivate_user(user_cognito_id: str) -> dict:
    """
    Deactivates a user in the database via GraphQL
    :param str user_cognito_id: The cognito id of the user
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_DEACTIVATE_USER,
        variables={
            "userBoolExp": {
                "cognito_user_id": {
                    "_eq": user_cognito_id
                }
            }
        }
    )
    return response.json()
