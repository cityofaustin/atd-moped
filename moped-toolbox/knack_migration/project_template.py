"""Utils to create project mutation objects"""
import uuid

from requests.api import get


def get_phase(phase_name, phase_start):
    phases = {
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
    phase_id = phases.get(phase_name, phase_start)
    if phase_name and not phase_id:
        raise ValueError(f"Unknown phase: {phase_name}")
    return {   
        "phase_id": phase_id,
        "phase_name": phase_name,
        "is_current_phase": True,
        "status_id": 1,
        "completion_percentage": 0,
        "completed": False,
        "phase_start": phase_start,
    }


def get_component(signal):
    uid = str(uuid.uuid4())
    return {
        "name": "Signal",
        "description": "Signal - Traffic",
        "component_id": 18,
        "status_id": 1,
        "moped_proj_features_components": {
            "data": [
                {
                    "name": "Signal",
                    "description": "Signal - Traffic",
                    "status_id": 1,
                    "moped_proj_feature_object": {
                        "data": {
                            "status_id": 1,
                            "location": {
                                "type": "Feature",
                                "properties": {
                                    "signal_id": signal["signal_id"],
                                    "location_name": signal["location_name"],
                                    "signal_type": signal["type"],
                                    "id": signal["id"],
                                    "renderType": "Point",
                                    "PROJECT_EXTENT_ID": uid,
                                    "sourceLayer": "drawnByUser",
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": signal["coordinates"],
                                },
                                "id": uid,
                            },
                        }
                    },
                }
            ]
        },
    }


def construct_project_object(
    *,
    project_name,
    project_description,
    current_phase,
    phase_name,
    phase_start,
    current_status,
    signals,
    knack_project_id
):
    phase = get_phase(phase_name)

    return {
        "object": {
            "current_phase": current_phase,
            "project_description": project_description,
            "project_name": project_name,
            "start_date": "2021-12-30",
            "current_status": current_status,
            "status_id": 2,
            "knack_project_id": knack_project_id,
            "moped_proj_phases": {
                "data": [
                    {
                        "phase_name": phase_name,
                        "is_current_phase": True,
                        "status_id": 1,
                        "completion_percentage": 0,
                        "completed": False,
                        "phase_start": phase_start,
                    }
                ]
            },
            "moped_proj_components": {
                "data": [get_component(signal) for signal in signals]
            },
        }
    }
