"""
Queries for upload_to_s3.py
"""

# we are explicit about the fields we select not only because these views hold data we
# don't care about but also because any datetime fields would require extra handling in
# order to JSON-serialize them
ORACLE_QUERIES = {
    "subproject_statuses": """
    SELECT
        SUB_PROJECT_STATUS_ID, SUB_PROJECT_STATUS_DESC, STATUS_REVIEW_DATE, REVIEWED_BY_EMAIL
    FROM
       ATD_SUB_PROJECT_STATUS_VW
    WHERE SP_NUMBER = :sp_number
    """
}

GRAPHQL_QUERIES = {
    "subproject_statuses": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}}) {
            added_by
            date_added
            ecapris_subproject_id
            is_deleted
            project_name_full
        }
    }
    """,
}