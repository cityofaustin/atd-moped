"""
The Moped Project class handler
"""
import MopedEvent


class MopedProject(MopedEvent):

    VALIDATION_SCHEMA = {
        "project_order": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_description": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "added_by": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "end_date": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_uuid": {
            "type": "string",
            "nullable": False,
            "required": True,
        },
        "project_description_public": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "current_status": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "eCapris_id": {
            "type": "integer",
            "nullable": True,
            "required": True,
        },
        "project_extent_ids": {
            "type": "dict",
            "nullable": True,
            "required": True,
        },
        "project_priority": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "start_date": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "date_added": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "timeline_id": {
            "type": "integer",
            "nullable": True,
            "required": True,
        },
        "current_phase": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_id": {
            "type": "integer",
            "nullable": False,
            "required": True,
        },
        "fiscal_year": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_name": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "capitally_funded": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_extent_geojson": {
            "type": "dict",
            "nullable": True,
            "required": True,
        },
        "project_length": {
            "type": "string",
            "nullable": True,
            "required": True,
        },
        "project_importance": {
            "type": "string",
            "nullable": True,
            "required": True,
        }
    }

    def build_variables(self) -> dict:
        """
        Builds the variables needed for a Hasura HTTP request
        :return: The dictionary containing all the variables needed
        :rtype: dict
        """
        return {
            "recordId": self.get_state("new")["project_id"],
            "recordType": "moped_project",
            "recordData": self.payload(),
            "description": self.get_diff(),
            "updatedBy": None,
            "updatedById": 0,
        }
