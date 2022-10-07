"""
Validation Schema for user creation
"""
USER_VALIDATION_SCHEMA = {
    "cognito_user_id": {
        "type": "string",
        "nullable": True,
        "required": False,
        "regex": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    },
    "date_added": {
        "type": "datetime",
        "nullable": True,
        "required": False,
    },
    "email": {
        "type": "string",
        "nullable": False,
        "required": True,
        "regex": "^[a-zA-Z0-9_.'+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        "empty": False,
        "minlength": 8,
        "maxlength": 128,
    },
    "first_name": {
        "type": "string",
        "nullable": False,
        "required": True,
        "empty": False,
        "regex": "^[a-zA-Z0-9 \-\.']+$",
        "minlength": 1,
        "maxlength": 128,
    },
    "last_name": {
        "type": "string",
        "nullable": False,
        "required": True,
        "empty": False,
        "regex": "^[a-zA-Z0-9 \-\.']+$",
        "minlength": 1,
        "maxlength": 128,
    },
    "is_coa_staff": {
        "type": "boolean",
        "nullable": True,
        "required": False,
    },
    "is_deleted": {
        "type": "boolean",
        "nullable": True,
        "required": False,
    },
    "title": {
        "type": "string",
        "nullable": True,
        "required": False,
    },
    "workgroup": {
        "type": "string",
        "nullable": False,
        "required": True,
        "empty": False,
        "minlength": 3,
        "maxlength": 128,
        "regex": "^[a-zA-Z0-9_\-\!\@\%\^\*\~\?\.\:\&\*\(\)\[\]\$\ ]*$",
    },
    "workgroup_id": {
        "type": "number",
        "nullable": False,
        "required": True,
        "empty": False,
        "min": 1,
        "max": 100,
    },
    "password": {
        "type": "string",
        "nullable": False,
        "required": True,
        "minlength": 8,
        "maxlength": 32,
        "regex": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$",
    },
    "roles": {
        "type": ["list"],
        "nullable": False,
        "required": True,
        "allowed": ["moped-admin", "moped-editor", "moped-viewer"],
        "minlength": 1,
        "maxlength": 3,
    },
}

PASSWORD_VALIDATION_SCHEMA = {
    "password": {
        "type": "string",
        "nullable": False,
        "required": True,
        "minlength": 8,
        "maxlength": 32,
        "regex": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$",
    },
}
