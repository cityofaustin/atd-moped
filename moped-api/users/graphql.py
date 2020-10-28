"""
Helper methods to update the database via GraphQL
"""
from graphql import run_query
from users.graphql_queries import *


def create_user(user: dict) -> dict:
    """
    Creates a user in the database via GraphQL
    :param dict user: The user details
    :return dict: The response from the GraphQL server
    """
    return True


def update_user(user: dict) -> dict:
    """
    Updates a user in the database via GraphQL
    :param dict user: The user details
    :return dict: The response from the GraphQL server
    """
    return True


def delete_user(user_cognito_id: str) -> dict:
    """
    Deletes a user in the database via GraphQL
    :param str user_cognito_id: The cognito id of the user
    :return dict: The response from the GraphQL server
    """
    return True


def deactivate_user(user_cognito_id: str) -> dict:
    """
    Deactivates a user in the database via GraphQL
    :param str user_cognito_id: The cognito id of the user
    :return dict: The response from the GraphQL server
    """
    return True