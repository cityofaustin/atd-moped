"""
Queries for FSD Data Warehouse

Oracle does not store trailing zeroes on numbers, but we need them to match eCapris subproject IDs in Moped DB which have them.
Ex. eCapris ID 10553.030 is stored as 10553.030 in Moped DB, but stored as 10553.03 in the Oracle DB.
So, we format the SP_NUMBER to have 3 decimal places using its defined Oracle type Number(18,3).
'FM999999999999999.000' formats the number to have 3 decimal places with trailing zeroes and 18 digits total.
"""

ORACLE_QUERIES = {
    "subproject_statuses": """
    SELECT
        TO_CHAR(SP_NUMBER, 'FM999999999999999.000') AS SP_NUMBER,
        SP_NAME,
        SUB_PROJECT_STATUS_ID,
        CURR_STATUS_FL, 
        SUB_PROJECT_STATUS_DESC,
        TO_CHAR(STATUS_REVIEW_DATE, 'YYYY-MM-DD HH24:MI:SS') AS STATUS_REVIEW_DATE,
        SUB_PROJECT_STATUS_IMPACTS,
        SUMM_DESC,
        REVIEWED_BY,
        REVIEWED_BY_EMAIL
    FROM
       ATD_SUB_PROJECT_STATUS_VW
    WHERE SP_NUMBER = :sp_number
    """
}

"""
Queries for Moped DB

The upsert query is used to insert or update the eCapris statuses into the Moped DB.
eCapris statuses can be edited within 7 days after the status review date so we need to handle updates.
"""
GRAPHQL_QUERIES = {
    "subproject_statuses": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}, is_deleted: {_eq: false}}, distinct_on: ecapris_subproject_id) {
            ecapris_subproject_id
        }
    }
    """,
    "subproject_statuses_upsert": """
    mutation UpsertEcaprisStatuses($objects: [ecapris_subproject_statuses_insert_input!]!) {
        insert_ecapris_subproject_statuses(objects: $objects, on_conflict: {constraint: ecapris_subproject_statuses_subproject_status_id_key, 
        update_columns: [ecapris_subproject_id, current_status_fl, sub_project_status_desc, subproject_status_impacts, summary_description, reviewed_by_name, reviewed_by_email]}) {
            returning {
                subproject_status_id
                ecapris_subproject_id
            }
        }
    }
    """,
}
