import React from "react";

import { Box, Icon, Typography, makeStyles } from "@material-ui/core";

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
      label: "sponsor ID",
    },
    project_website: {
      label: "project website",
    },
    knack_project_id: {
      label: "knack internal ID",
    },
    // deprecated column, but keeping because historical activities depend on it
    purchase_order_number: {
      label: "purchase order number",
    },
    task_order: {
      label: "task order",
    },
    work_assignment_id: {
      label: "work assignment ID",
    },
    parent_project_id: {
      label: "parent project id",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
  boldText: {
    fontWeight: 700,
  }
}));

const getEntryText = (change) => {
  if (change.description.length === 0) {
    return `${change.record_data.data.new.project_name} created`;
  }
  if (change.description[0].old === null) {
    return `Added ${entryMap.fields[change.description[0].field].label} "${
      change.description[0].new
    }"`;
  }
  return `Changed ${entryMap.fields[change.description[0].field].label} from "${
    change.description[0].old
  }" to "${change.description[0].new}"`;
};

const ProjectActivityEntry = ({ change, getChangeIcon }) => {
  const classes = useStyles();

  return (
    <Box display="flex" p={0}>
      <Box p={0}>
        <Icon>{getChangeIcon(change.operation_type, change.record_type)}</Icon>
      </Box>
      <Box p={0} flexGrow={1}>
        <Typography variant="body2" className={classes.entryText}>
          {getEntryText(change)}
        </Typography>
      </Box>
    </Box>
  );
};


export default ProjectActivityEntry;
