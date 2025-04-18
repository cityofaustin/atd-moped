"""
Queries for upload_to_s3.py
"""

# we are explicit about the fields we select not only because these views hold data we
# don't care about but also because any datetime fields would require extra handling in
# order to JSON-serialize them
QUERIES = {
    "task_orders": """
    SELECT
        atd_tk.TASK_ORDER_DEPT,
        atd_tk.TASK_ORDER_ID,
        atd_tk.TASK_ORDER_DEPT || atd_tk.TASK_ORDER_ID as DEPT_TK_ID,
        atd_tk.TASK_ORDER_DESC,
        atd_tk.TASK_ORDER_STATUS,
        atd_tk.TASK_ORDER_TYPE,
        atd_tk.TK_CURR_AMOUNT,
        atd_tk.CHARGED_AMOUNT,
        atd_tk.TASK_ORDER_BAL,
        atd_tk.TASK_ORDER_ESTIMATOR,
        buyer_tk.BYR_FDU
    FROM
        DEPT_2400_TK_VW atd_tk
        LEFT JOIN ( SELECT DISTINCT
                TASK_ORD_CD,
                BYR_FDU
            FROM
                REL_BUYER_SELLER_FDU_TK) buyer_tk ON atd_tk.TASK_ORDER_ID = buyer_tk.TASK_ORD_CD
    WHERE
        TASK_ORDER_STATUS IS NOT NULL
    """,
    "units": """
    SELECT
        DEPT_UNIT_ID,
        DEPT_ID,
        DEPT,
        UNIT,
        UNIT_LONG_NAME,
        UNIT_SHORT_NAME,
        DEPT_UNIT_STATUS
    FROM
        lu_dept_units
    WHERE
        DEPT in(2400, 2507, 6200, 6207)
	""",
    "objects": """
    SELECT
        OBJ_ID,
        OBJ_CLASS_ID,
        OBJ_CATEGORY_ID,
        OBJ_TYPE_ID,
        OBJ_GROUP_ID,
        OBJ_CODE,
        OBJ_LONG_NAME,
        OBJ_SHORT_NAME,
        OBJ_DESC,
        OBJ_REIMB_ELIG_STATUS,
        OBJ_STATUS,
        ACT_FL
    FROM
        lu_obj_cd
	""",
    "master_agreements": """
    SELECT
        DOC_CD,
        DOC_DEPT_CD,
        DOC_ID,
        DOC_DSCR,
        DOC_PHASE_CD,
        VEND_CUST_CD,
        LGL_NM
    FROM
        DEPT_2400_MA_VW
    """,
    "fdus": """
    SELECT
        DEPT_CODE_NAME,
        SUB_PROJECT_ID,
        SUBPROJECT_ID_UK,
        SP_NUMBER_TXT,
        FDU_ID,
        FDU,
        FUND,
        FUNDNAME,
        DEPT,
        DEPT_ID,
        DEPT_UNIT_ID,
        DEPT_UNIT_STATUS,
        UNIT,
        UNIT_LONG_NAME,
        UNIT_SHORT_NAME
    FROM
        ATD_SUBPROJECT_FDU_VW
	""",
    "subprojects": """
        SELECT
        PROJECT_NUMBER,
        SP_NUMBER_TXT,
        SP_NAME,
        SP_DESCRIPTION,
        SP_DETAILED_SCOPE,
        SUB_PROJECT_MANAGER,
        SUB_PROJECT_MANAGING_DEPT,
        SP_STATUS
    FROM
        MSTR_IA_DEV.DEPT_2400_SUBPRJ_VW
	""",
}