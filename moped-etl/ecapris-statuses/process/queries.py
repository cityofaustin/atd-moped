"""
Queries for sync
"""

ORACLE_QUERIES = {
    "subproject_statuses": """
    SELECT
        SP_NUMBER,
        SP_NAME,
        SUB_PROJECT_STATUS_ID,
        CURR_STATUS_FL, 
        SUB_PROJECT_STATUS_DESC,
        STATUS_REVIEW_DATE,
        SUB_PROJECT_STATUS_IMPACTS,
        SUMM_DESC,
        REVIEWED_BY,
        REVIEWED_BY_EMAIL
    FROM
       ATD_SUB_PROJECT_STATUS_VW
    WHERE SP_NUMBER = :sp_number
    """
}

GRAPHQL_QUERIES = {
    "subproject_statuses": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}, is_deleted: {_eq: false}, distinct_on: ecapris_subproject_id}}) {
            ecapris_subproject_id
        }
    }
    """,
    "subproject_statuses_insert": """
    mutation InsertEcaprisStatuses($objects: [ecapris_subproject_statuses_insert_input!]!) {
        insert_ecapris_subproject_statuses(objects: $objects, on_conflict: {constraint: ecapris_subproject_statuses_subproject_status_id_key, update_columns: []}) {
            returning {
                subproject_status_id
            }
        }
    }
    """,
}