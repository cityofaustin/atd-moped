import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";

const entryMap = {
  label: "Project",
  fields: {
    project_name: {
      label: "name",
    },
    project_description: {
      label: "description",
    },
    ecapris_subproject_id: {
      label: "eCAPRIS subproject ID",
    },
    current_status: {
      label: "current status",
    },
    current_phase: {
      label: "phase",
    },
    is_deleted: {
      label: "soft delete status",
    },
    milestone_id: {
      label: "milestone ID",
    },
    status_id: {
      label: "status ID",
    },
    // deprecated column, but keeping because historical activities depend on it
    contractor: {
      label: "contractor",
    },
    project_sponsor: {
      label: "project sponsor",
      lookup: "moped_entity",
    },
    project_website: {
      label: "project website",
    },
    knack_project_id: {
      label: "Knack internal ID",
    },
    // deprecated column, but keeping because historical activities depend on it
    purchase_order_number: {
      label: "purchase order number",
    },
    task_order: {
      label: "task order",
    },
    // deprecated column, but keeping because historical activities depend on it
    work_assignment_id: {
      label: "work assignment ID",
    },
    parent_project_id: {
      label: "parent project id",
    },
    interim_project_id: {
      label: "Interim MPD (Access) ID",
    },
    project_lead_id: {
      label: "project lead",
      lookup: "moped_entity",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
  boldText: {
    fontWeight: 700,
  },
  strikeText: {
    textDecoration: "line-through",
  },
}));

const getEntryText = (change, legacyVersion, classes) => {
  // adding a field
  if (change.description[0].old === null) {
    return (
      <Typography variant="body2" className={classes.entryText}>
        Added {entryMap.fields[change.description[0].field].label}{" "}
        {change.description[0].new}
      </Typography>
    );
  }

  // updating a field
  // the legacy version has only a string as the value in "old"
  if (legacyVersion) {
    return (
      <Typography variant="body2" className={classes.entryText}>
        Changed {entryMap.fields[change.description[0].field].label} from "
        <span className={classes.strikeText}>{change.description[0].old}</span>"{" "}
        to "{change.description[0].new}"
      </Typography>
    );
  } else {
    // the updated version contains an object with the entire state
    return (
      <Typography variant="body2" className={classes.entryText}>
        Changed {entryMap.fields[change.description[0].field].label} from "
        <span className={classes.strikeText}>
          {change.description[0].old[change.description[0].field]}
        </span>
        " to "{change.description[0].new[change.description[0].field]}";
      </Typography>
    );
  }
};

const getEntryTextWithLookup = (change, legacyVersion, classes, entityList) => {
  // adding a new field
  if (change.description[0].old === null) {
    return (
      <Typography variant="body2" className={classes.entryText}>
        Added {entityList[change.description[0].new]} as{" "}
        {entryMap.fields[change.description[0].field].label}
      </Typography>
    );
  }

  // updating a field
  if (legacyVersion) {
    return (
      <Typography variant="body2" className={classes.entryText}>
        Changed {entryMap.fields[change.description[0].field].label} from "
        <span className={classes.strikeText}>{entityList[change.description[0].old]}</span>"{" "}
        to "{entityList[change.description[0].new]}"
      </Typography>
    );
  } else {
    return (
      <Typography variant="body2" className={classes.entryText}>
        Changed {entryMap.fields[change.description[0].field].label} from "
        <span className={classes.strikeText}>
          {entityList[change.description[0].old[change.description[0].field]]}
        </span>
        " to "
        {entityList[change.description[0].new[change.description[0].field]]}";
      </Typography>
    );
  }
};

const ProjectActivityEntry = ({ change, entityList }) => {
  const classes = useStyles();

  let changeData = {};
  // the legacy way has the change data in event/data.
  // In the new schema, event is undefined
  const legacyVersion = !!change.record_data.event;

  if (legacyVersion) {
    changeData = change.record_data.event.data;
  } else {
    changeData = change.record_data.data;
  }

  // project creation
  if (change.description.length === 0) {
    return (
      <Box display="flex" p={0}>
        <Box p={0}>
          <BeenhereOutlinedIcon />
        </Box>
        <Box p={0} flexGrow={1}>
          <Typography variant="body2" className={classes.entryText}>
            {changeData.new.project_name} created
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" p={0}>
      <Box p={0}>
        <span className="material-symbols-outlined">summarize</span>
      </Box>
      <Box p={0} flexGrow={1}>
        {entryMap.fields[change.description[0].field]?.lookup
          ? getEntryTextWithLookup(change, legacyVersion, classes, entityList)
          : getEntryText(change, legacyVersion, classes)}
      </Box>
    </Box>
  );
};

export default ProjectActivityEntry;
