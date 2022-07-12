import os

API_ENVIRONMENT = os.getenv("API_ENVIRONMENT", "STAGING").lower()
COGNITO_DYNAMO_TABLE_NAME = os.getenv("COGNITO_DYNAMO_TABLE_NAME", "")
HASURA_ADMIN_SECRET = os.getenv("HASURA_ADMIN_SECRET", "")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT", "")

# Prep Hasura query
HASURA_HTTP_HEADERS = {
    "Accept": "*/*",
    "Content-Type": "application/json",
    "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
}

#
# Validation Schema for SQS
#
HASURA_EVENT_VALIDATION_SCHEMA = {
    "event": {
        "type": "dict",
        "schema": {
            "session_variables": {
                "type": "dict",
                "allow_unknown": True,
                "schema": {
                    "x-hasura-role": {
                        "type": "string",
                        "required": True,
                        "allowed": [
                            "admin",
                            "moped-admin",
                            "moped-editor",
                            "moped-viewer",
                        ]
                    },
                    "x-hasura-user-id": {
                        "type": "string",
                        "required": True,
                    },
                }
            },
            "op": {
                "type": "string",
                "required": True,
                "allowed": [
                    "INSERT",
                    "UPDATE",
                    "DELETE",
                ]
            },
            "data": {
                "type": "dict",
                "schema": {
                    "old": {
                        "type": "dict",
                        "required": True,
                        "nullable": True,
                    },
                    "new": {
                        "type": "dict",
                        "required": True,
                        "nullable": True,
                    }
                }
            },
            "trace_context": {
                "type": "dict",
                "schema": {
                    "trace_id": {
                        "type": "string",
                        "required": True,
                    },
                    "span_id": {
                        "type": "string",
                        "required": True,
                    }
                },
            }
        },
    },
    "created_at": {
        "type": "string",
        "required": True,
    },
    "id": {
        "type": "string",
        "required": True,
    },
    "delivery_info": {
        "type": "dict",
        "schema": {
            "max_retries": {
                "type": "integer",
                "required": True,
            },
            "current_retry": {
                "type": "integer",
                "required": True,
            },
        }
    },
    "trigger": {
        "type": "dict",
        "schema": {
            "name": {
                "type": "string",
                "required": True,
                "nullable": False,
                "minlength": 12,
            }
        }
    },
    "table": {
        "type": "dict",
        "schema": {
            "schema": {
                "type": "string",
                "required": True,
                "allowed": ["public"]
            },
            "name": {
                "type": "string",
                "required": True,
            }
        },
    },
}