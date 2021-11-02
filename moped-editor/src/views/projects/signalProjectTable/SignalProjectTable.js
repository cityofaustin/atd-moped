import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import MaterialTable, { MTableEditRow } from "material-table";
import { NavLink as RouterLink } from "react-router-dom";

import Page from "src/components/Page";
import typography from "../../../theme/typography";
import {
  SIGNAL_PROJECTS_QUERY,
  UPDATE_SIGNAL_PROJECT,
} from "../../../queries/signals";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

const SignalProjectTable = () => {
  const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const [updateSignalProject] = useMutation(UPDATE_SIGNAL_PROJECT);

  if (error) {
    console.log(error);
  }
  if (loading || !data) {
    return <CircularProgress />;
  }

  // Assemble the data for each signal entry?
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
    if (project?.moped_proj_features) {
      project.moped_proj_features.forEach(feature => {
        signal_ids.push(feature?.location?.properties.signal_id)
      })
    }
    project["signal_ids"] = signal_ids
    console.log(project["signal_ids"])

    // Targeted Construction Start > moped_proj_phases where phase = Construction,
    // display the phase start date, otherwise leave blank
    project["construction_start"] = "";
    project["current_phase"] = "";
    if (project?.moped_proj_phases?.length) {
      const constructionPhase = project.moped_proj_phases.find(
        p => p.phase_name === "construction"
      );
      if (constructionPhase) {
        project["construction_start"] = constructionPhase.phase_start;
      }
      const currentPhase = project.moped_proj_phases.find(p => p.is_current_phase);
      if (currentPhase) {
        project["current_phase"] = currentPhase.phase_name
      }
    }


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
        <RouterLink
          to={`/moped/projects/${entry.project_id}/`}
          className={"MuiTypography-colorPrimary"}
        >
          {entry.project_name}
        </RouterLink>
      ),
    },
    {
      title: "Signal IDs",
      field: "signal_ids",
      editable: "never",
      // cell style font needs to be set if editable is never
      cellStyle: { fontFamily: typography.fontFamily },
      render: entry => entry.signal_ids.join(", ")
    },
    {
      title: "Project type",
      field: "project_type",
      // update after other issue is merged
    },
    {
      title: "Current phase",
      field: "current_phase",
      editable: "never",
      cellStyle: { fontFamily: typography.fontFamily },
    },
    {
      title: "Task order",
      field: "task_order",
      // placeholder for task order issue
    },
    {
      title: "Contractor/Contract",
      field: "contractor",
    },
    {
      title: "Internal status note",
      field: "status_update", // Status update (from Project details page)
      editable: "never",
      cellStyle: { fontFamily: typography.fontFamily },
    },
    {
      title: "Funding source",
      field: "funding_source",
    },
    {
      title: "Project DO#",
      field: "project_do",
    },
    {
      title: "Project sponsor",
      field: "project_sponsor",
    },
    {
      title: "Targeted construction start",
      field: "construction_start",
      editable: "never",
      cellStyle: { fontFamily: typography.fontFamily },
      render: entry =>
        new Date(entry.construction_start).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }),
    },
    {
      title: "Last modified",
      field: "last_modified",
      editable: "never",
      cellStyle: { fontFamily: typography.fontFamily },
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
    },
  };

  console.log("data ", data);

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Page title={"signal view"}>
            <MaterialTable
              columns={columns}
              components={{
                EditRow: props => (
                  <MTableEditRow // if its not editable, its coming out with wrong typography
                    {...props}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                        // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                      }
                    }}
                  />
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
                rowStyle: { fontFamily: typography.fontFamily },
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
