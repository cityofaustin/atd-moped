import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MaterialTable, { MTableEditRow, MTableEditField } from "material-table";

import Page from "src/components/Page";
import typography from "../../../theme/typography";
import {
  SIGNAL_PROJECTS_QUERY,
  UPDATE_SIGNAL_PROJECT,
} from "../../../queries/signals";
import { PROJECT_UPDATE_SPONSOR } from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import RenderFieldLink from "./RenderFieldLink";

const useStyles = makeStyles({
  signalsTable: {
    "& .MuiTableCell-root": {
      // override the default padding of 16px
      padding: "14px",
    },
  },
});

const SignalProjectTable = () => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const [updateSignalProject] = useMutation(UPDATE_SIGNAL_PROJECT);
  const [updateProjectSponsor] = useMutation(PROJECT_UPDATE_SPONSOR);

  if (error) {
    console.log(error);
  }
  if (loading || !data) {
    return <CircularProgress />;
  }

  const entityList = data?.moped_entity ?? [];

  // Assemble the data for each signal entry
  data.moped_project.forEach(project => {
    // project status update equivalent to most recent project note
    project["status_update"] = "";
    if (project?.moped_proj_notes?.length) {
      const note = project.moped_proj_notes[0]["project_note"];
      // Remove any HTML tags
      project["status_update"] = note
        ? String(note).replace(/(<([^>]+)>)/gi, "")
        : "";
    }

    // Signal IDs
    const signal_ids = [];
    if (project?.moped_proj_features.length) {
      project.moped_proj_features.forEach(feature => {
        signal_ids.push(feature?.location?.properties.signal_id);
      });
    }
    project["signal_ids"] = signal_ids;

    // moped project types
    const project_types = [];
    if (project?.moped_project_types?.length) {
      project.moped_project_types.forEach(projType => {
        project_types.push(projType?.moped_type?.type_name);
      });
    }
    project["project_types"] = project_types;

    // project sponsor
    project["project_sponsor"] = entityList.find(
      e => e.entity_id === project?.project_sponsor
    );

    // Targeted Construction Start > moped_proj_phases where phase = Construction,
    // display the phase start date, otherwise leave blank
    project["construction_start"] = null;
    project["current_phase"] = "";
    if (project?.moped_proj_phases?.length) {
      const constructionPhase = project.moped_proj_phases.find(
        p => p.phase_name === "construction"
      );
      if (constructionPhase) {
        project["construction_start"] = constructionPhase.phase_start;
      }
      const currentPhase = project.moped_proj_phases.find(
        p => p.is_current_phase
      );
      if (currentPhase) {
        project["current_phase"] = currentPhase.phase_name;
      }
    }

    // funding source
    const funding_sources = [];
    if (project?.moped_proj_funding?.length) {
      project.moped_proj_funding.forEach(source => {
        funding_sources.push(source?.moped_fund_source?.funding_source_name);
      });
    }
    project["funding_sources"] = funding_sources;
  });

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Project name",
      field: "project_name",
      editable: "never",
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_name}
        />
      ),
    },
    {
      title: "Signal IDs",
      field: "signal_ids",
      editable: "never",
      // cell style font needs to be set if editable is never
      cellStyle: typographyStyle,
      render: entry => entry.signal_ids.join(", "),
    },
    {
      title: "Project types",
      field: "project_types",
      editable: "never",
      render: entry => entry.project_types.join(", "),
    },
    {
      title: "Current phase",
      field: "current_phase",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.current_phase}
          tab="timeline"
        />
      ),
    },
    {
      title: "Task order",
      field: "task_order",
      // placeholder for task order issue
    },
    {
      title: "Contractor/Contract",
      field: "contractor",
      emptyValue: "blank",
      render: entry => (entry.contractor === "" ? "blank" : entry.contractor),
    },
    {
      title: "Internal status note",
      field: "status_update", // Status update (from Project details page)
      editable: "never",
      cellStyle: { ...typographyStyle, minWidth: "300px" },
    },
    {
      title: "Funding source",
      field: "funding_sources",
      cellStyle: typographyStyle,
      editable: "never",
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.funding_sources.join(", ")}
          tab="funding"
        />
      ),
    },
    {
      title: "Project DO#",
      field: "purchase_order_number",
      emptyValue: "blank",
    },
    {
      title: "Project sponsor",
      field: "project_sponsor",
      render: entry => (
        <Typography>{entry?.project_sponsor?.entity_name}</Typography>
      ),
      customEdit: "projectSponsor",
    },
    {
      title: "Targeted construction start",
      field: "construction_start",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry =>
        entry.construction_start
          ? new Date(entry.construction_start).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })
          : "",
    },
    {
      title: "Last modified",
      field: "last_modified",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry =>
        new Date(entry.updated_at).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }),
    },
  ];

  const projectActions = {
    update: (newData, oldData) => {
      // initialize update object with old data
      const updatedProjectObject = {
        ...oldData,
      };
      // Array of differences between new and old data
      let differences = Object.keys(oldData).filter(
        key => oldData[key] !== newData[key]
      );

      // Loop through the differences and assign newData values.
      differences.forEach(diff => {
        updatedProjectObject[diff] = newData[diff];
      });

      // Remove extraneous fields given by MaterialTable that
      // Hasura doesn't need
      delete updatedProjectObject.tableData;
      delete updatedProjectObject.__typename;

      updateSignalProject({
        variables: updatedProjectObject,
      });
    },
    cellUpdate: (newData, oldData, rowData, columnDef) => {
      console.log(columnDef);
      if (columnDef.customEdit === "projectSponsor") {
        updateProjectSponsor({
          variables: {
            projectId: rowData.project_id,
            entityId: newData.entity_id,
          },
        });
      } else {
        const updatedProjectObject = {
          ...rowData,
        };
        updatedProjectObject[columnDef.field] = newData;

        // Remove extraneous fields given by MaterialTable that
        // Hasura doesn't need
        delete updatedProjectObject.tableData;
        delete updatedProjectObject.__typename;

        updateSignalProject({
          variables: updatedProjectObject,
        });
      }
    },
  };

  const cellEditComponents = {
    projectSponsor: props => (
      <Autocomplete
        value={props.value}
        defaultValue={"None"}
        options={entityList}
        getOptionLabel={e => e.entity_name}
        onChange={(event, value) => props.onChange(value)}
        renderInput={params => (
          <TextField {...params} variant="standard" label={null} />
        )}
      />
    ),
  };

  console.log("data ", data);

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Page title={"signal view"} className={classes.signalsTable}>
            <MaterialTable
              columns={columns}
              components={{
                EditRow: props => (
                  <MTableEditRow
                    {...props}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                        // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                      }
                    }}
                  />
                ),
                EditField: props =>
                  props.columnDef.customEdit ? (
                    cellEditComponents[props.columnDef.customEdit](props)
                  ) : (
                    <MTableEditField {...props} />
                  ),
              }}
              data={data.moped_project}
              title={
                <Typography variant="h2" color="primary">
                  Signals Table
                </Typography>
              }
              options={{
                ...(data.moped_project.length < PAGING_DEFAULT_COUNT + 1 && {
                  paging: false,
                }),
                search: false,
                rowStyle: typographyStyle,
                actionsColumnIndex: -1,
              }}
              localization={{
                header: {
                  actions: "",
                },
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      projectActions.update(newData, oldData);

                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
              }}
              cellEditable={{
                cellStyle: { minWidth: "300px" },
                onCellEditApproved: (
                  newValue,
                  oldValue,
                  rowData,
                  columnDef
                ) => {
                  return new Promise((resolve, reject) => {
                    setTimeout(() => {
                      projectActions.cellUpdate(
                        newValue,
                        oldValue,
                        rowData,
                        columnDef
                      );
                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  });
                },
              }}
            />
          </Page>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default SignalProjectTable;
