LOG_DIR = "log"
DATA_RAW_DIR = "data/raw"
DATA_READY_DIR = "data/ready"

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
]

FIELDS = {
    "id": "knack_project_id",
    "field_3860": "phase_name",
    "field_3950" : "comments",
    "field_3860": "phase_name",
    "field_3857": "project_name",
    "field_199_raw": "signals",
    "field_3946_raw": "task_orders",
}

# copied from Moped local 
PHASES = {
    "Unknown": 0,
    "Preliminary engineering": 3,
    "Scoping": 4,
    "Preliminary design": 5,
    "Pre-construction": 7,
    "Potential": 1,
    "Planned": 2,
    "Design": 6,
    "Construction-ready": 8,
    "Construction": 9,
    "Post-construction": 10,
    "Complete": 11,
    "Bid/Award/Execution": 12,
}