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

  if (loading || !data) return <CircularProgress />;
  if (error) console.log(error);

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
          to={`/projects/${entry.project_id}/`}
          // state={jsonValues.state}
          className={"MuiTypography-colorPrimary"}
        >
          {entry.project_name}
        </RouterLink>
      ),
    },
    {
      title: "Signal IDs",
      field: "signal_ids",
      type: "numeric",
      // would these link to the knack page for the signal?
      // https://atd.knack.com/amd#projects/signal-details/5817c079e052e0422be6c40a/
    },
    {
      title: "Project type",
      field: "project_type",
    },
    {
      title: "Current phase",
      field: "current_phase", // updating current phase happens now in the timeline, we actually pull the wrong one
      editable: "never",
    },
    {
      title: "Task order",
      field: "task_order",
    },
    {
      title: "Contractor/Contract",
      field: "contractor",
    },
    {
      title: "Internal status note",
      field: "status_update", // Status update (from Project details page)
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
      field: "moped_phase", // moped_proj_phases where phase = Construction, display the phase start date, otherwise leave blank
      editable: "never",
    },
    {
      title: "Last modified",
      field: "last_modified",
      editable: "never",
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
                // Action: props => {
                //   // If isn't the add action
                //   if (
                //     typeof props.action === typeof Function ||
                //     props.action.tooltip !== "Add"
                //   ) {
                //     return <MTableAction {...props} />;
                //   } else {
                //     return (
                //       <div>+</div>
                //       // <Button
                //       //   variant="contained"
                //       //   color="primary"
                //       //   size="large"
                //       //   startIcon={<AddCircleIcon />}
                //       //   ref={addActionRef}
                //       //   onClick={props.action.onClick}
                //       // >
                //       //   Add team member
                //       // </Button>
                //     );
                //   }
                // },
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
                search: false, // assuming this is false to match other material tables
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
                      projectActions.cellUpdate(newValue, oldValue, rowData, columnDef);
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
