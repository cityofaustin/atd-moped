LOG_DIR = "log"
DATA_RAW_DIR = "data/raw"
DATA_READY_DIR = "data/ready"
KNACK_PROJECTS_OBJECT = "object_201"
KNACK_MOPED_PROJECT_ID_FIELD = "field_4133"

# for attachments
KNACK_PROJECT_FILES_OBJECT = "object_204"
KNACK_ATTACHMENT_FIELD_ID = "field_3956"
KNACK_ATTACHMENT_MOPED_PROJ_ID_FIELD = "field_4138"


DATA_SOURCES = [
    {
        "name": "signals",
        "path": f"{DATA_RAW_DIR}/signals.json",
        "scene": "view_73",
        "view": "view_197",
    },
    {
        "name": "projects",
        "path": f"{DATA_RAW_DIR}/projects.json",
        "scene": "scene_1265",
        "view": "view_3085",
    },
    {
        "name": "task_orders",
        "path": f"{DATA_RAW_DIR}/task_orders.json",
        "scene": "scene_1181",
        "view": "view_2896",
    },
    {
        "name": "dept_unit",
        "path": f"{DATA_RAW_DIR}/dept_unit.json",
        "object": "object_189",
    },
]

FIELDS = {
    "id": "knack_project_id",
    "field_3860": "phase_name",
    "field_3859": "project_note",
    "field_3857": "project_name",
    "field_199_raw": "signals",
    "field_3946_raw": "task_orders",
    "field_3945.field_168_raw": "email",
    "field_3952_raw": "work_assignment_id",
    "field_3948_raw": "contractor",
    "field_3951_raw": "purchase_order_number",
    "field_3953_raw": "project_sponsor",
    "field_3947_raw": "funding_source_name",  # 'Funding' in data tracker
    "field_3962_raw": "fund",
    "field_3961_raw": "dept_unit",
    "field_3954_raw": "project_type_name",
    "field_4135": "ecapris_subproject_id",
    "field_4075": "completion_date",  # will be translated to a phase
    "field_4137_raw": "project_partner",
    "field_3995": "project_inspector",
    "field_3994": "designer",
    "field_3950": "internal_status_note",
    "field_3949": "external_status_note",
    "field_3944_raw": "modified_date",
    "field_4075_raw": "project_completion_date",
    "field_3982": "target_construction_start",
}

FUNDING_MAP = {
    "Safety": None,
    "Private Developer": "Private Development",
    "AMD": "Austin Transportation",
    "Active Transportation": "Austin Transportation",
    "University of Texas": "University of Texas",
    "TxDOT - HSIP": "Texas Department of Transportation",
    "TxDOT": "Texas Department of Transportation",
    "Travis County": "Travis County",
    "Other": "Other",
    "None Identified": "None identified",
    "CIP Project": "Other",
    "CAMPO Grant - PHB": "Capital Area Metropolitan Planning Organization",
    "2016 Bond Corridor": "2016 Bond",
    "2016 Bond - SRTS": "2016 Bond",
    "2016 Bond - Safety": "2016 Bond",
    "1/4 Cent": "Quarter Cent",
}

INSPECTORS_MAP = {
    "Ben <redacted>": "<redacted email>",
    "Willard <redacted>": "<redacted email>",
    "Julian <redacted>": "<redacted email>",
}
