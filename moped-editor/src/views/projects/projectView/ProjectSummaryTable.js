import React, { useEffect, useState } from "react";
import { Box, Grid, Icon, Input } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  editIcon: {
    cursor: "pointer",
    marginLeft: "8px",
    fontSize: "16px",
  },
}));

const ProjectSummaryTable = ({ data, loading, error, refetch }) => {
  const classes = useStyles();

  const projectDetails = {
    current_status: {
      label: "Current Status",
      type: "string",
      editable: true,
    },
    current_phase: {
      label: "Current Phase",
      type: "string",
      editable: true,
    },
    project_description: {
      label: "Description",
      type: "string",
      editable: true,
    },
    start_date: {
      label: "Start Date",
      type: "string",
      editable: true,
    },
    fiscal_year: {
      label: "Fiscal Year",
      type: "string",
      editable: true,
    },
    project_priority: {
      label: "Priority",
      type: "string",
      editable: true,
    },
    capitally_funded: {
      label: "Capital Funding",
      type: "boolean",
      editable: true,
    },
    ecapris_id: {
      label: "eCapris ID",
      type: "string",
      editable: true,
    },
  };

  const handleFieldUpdate = e => {
    e.preventDefault();
    setEditField("");
    setIsEditing(true);
  };

  const [editField, setEditField] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const getValue = field => {
    return data.moped_project[0][field] ?? null;
  };

  const formatValue = field => {
    let formattedValue = getValue(field);
    const fieldType = projectDetails[field]?.type ?? "string";

    switch (fieldType) {
      case "boolean":
        formattedValue = formattedValue === true ? "Yes" : "No";
        break;
      case "string":
        formattedValue =
          formattedValue === "" ? (
            <Box color="text.disabled">
              <p>No data</p>
            </Box>
          ) : (
            formattedValue
          );
        break;
      default:
        break;
    }
    return formattedValue;
  };

  useEffect(() => {
    setIsEditing(editField !== "");
  }, [editField]);

  return (
    <Grid item xs={12} md={6}>
      Editing? {String(isEditing)}
      <br />
      <Grid container>
        {Object.keys(projectDetails).map(field => {
          const fieldType = projectDetails[field]?.type ?? "string";

          return (
            <Grid key={projectDetails[field]?.label} item xs={6}>
              <Box mb={2}>
                <h4>{projectDetails[field]?.label ?? "Unknown"}</h4>
                {isEditing && editField === field ? (
                  <form onSubmit={e => handleFieldUpdate(e)}>
                    {fieldType === "select" && (
                      <Input
                        name={null}
                        id={null}
                        onChange={null}
                        defaultValue={null}
                        type="select"
                      >
                        {/*{selectOptions.map(option => (*/}
                        {/*    <option*/}
                        {/*        value={option[`${lookupPrefix}_id`]}*/}
                        {/*    >*/}
                        {/*      {option[`${lookupPrefix}_desc`]}*/}
                        {/*    </option>*/}
                        {/*))}*/}
                        Test
                      </Input>
                    )}
                    {fieldType === "string" && (
                      <input type="text" defaultValue={null} onChange={null} />
                    )}
                    <button type="submit">
                      <Icon className={classes.editIcon} onClick={null}>
                        check
                      </Icon>
                    </button>
                    <button type="cancel">
                      <Icon className={classes.editIcon} onClick={null}>
                        close
                      </Icon>
                    </button>
                  </form>
                ) : (
                  <p>
                    {formatValue(field)}
                    {projectDetails[field].editable && !isEditing && (
                      <Icon
                        className={classes.editIcon}
                        onClick={() => setEditField(field)}
                      >
                        create
                      </Icon>
                    )}
                  </p>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default ProjectSummaryTable;
