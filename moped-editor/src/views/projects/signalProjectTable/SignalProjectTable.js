import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";
import { NavLink as RouterLink } from "react-router-dom";

import Page from "src/components/Page";
import typography from "../../../theme/typography";
import { SIGNAL_PROJECTS_QUERY } from "../../../queries/signals";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

const SignalProjectTable = () => {
  const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
    fetchPolicy: "no-cache",
  });

  console.log(data, loading, error);

  if (loading || !data) return <CircularProgress />;

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Project name",
      field: "project_name", // clicking on this should be a link to the project
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
    },
    {
      title: "Project type",
      field: "project_type",
    },
    {
      title: "Current phase",
      field: "current_phase",
    },
    {
      title: "Task order",
      field: "task_order",
    },
    {
      title: "Contractor",
      field: "contractor", // new column in moped_proj
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

  /**
   * Data handlers for editable actions based on isNewProject boolean <MaterialTable>
   */
  const projectActions = {
    // add: newData => {
    //   console.log(newData);

    // },
    update: (newData, oldData) => {
      console.log(newData, oldData);
      // // Creates a set of tuples that contain the user id and the role comprised by the new state
      // const newStateTuples = newData.role_id.map(role_id => [
      //   newData.user_id,
      //   role_id,
      // ]);

      // // Creates a set of tuples that contain the user id and role comprised by the old state
      // const oldStateTuples = oldData.role_id.map(role_id => [
      //   oldData.user_id,
      //   role_id,
      // ]);

      // /**
      //  * From the old state, we need to remove the tuples that are not present
      //  * in the new state, these tuples are 'orphans' and need to be archived.
      //  */
      // const orphanData = oldStateTuples.filter(
      //   oldTuple => !tuplesContain(newStateTuples, oldTuple)
      // );

      // *
      //  * We must build a unique set of tuples so that there are no repeated
      //  * operations run against the database

      // const uniqueSetOfTuples = [...newStateTuples, ...oldStateTuples].reduce(
      //   (accumulator, item) => {
      //     if (!tuplesContain(accumulator, item)) accumulator.push(item);
      //     return accumulator;
      //   },
      //   []
      // );

      // // Removed ids means they are not present in new data,
      // const updatedPersonnelData = uniqueSetOfTuples.map(
      //   (currentTuple, index) => {
      //     return {
      //       project_id: Number.parseInt(projectId),
      //       user_id: currentTuple[0],
      //       role_id: currentTuple[1],
      //       status_id: tuplesContain(orphanData, currentTuple) ? 0 : 1,
      //       notes: index === 0 ? newData.notes : "",
      //     };
      //   }
      // );

      // upsertProjectPersonnel({
      //   variables: {
      //     objects: updatedPersonnelData,
      //   },
      // });
    },
  };

  // const data = [
  //   {
  //     project_name: "My project",
  //     project_id: 123,
  //     signal_ids: 44, // is this a string or number
  //     project_type: "Signal - Mod",
  //     current_phase: "",
  //     task_order: "34FTJSDL:",
  //     contractor: "Name",
  //     status_update: "this is a status update",
  //     funding_source: "2016 Bond - Safety",
  //     project_do: "190911 13453",
  //     project_sponsor: "Private Development",
  //     moped_phase: "10/12/2021",
  //     last_modified: "10/18/2021",
  //   }
  // ];

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
                Action: props => {
                  // If isn't the add action
                  if (
                    typeof props.action === typeof Function ||
                    props.action.tooltip !== "Add"
                  ) {
                    return <MTableAction {...props} />;
                  } else {
                    return (
                      <div>+</div>
                      // <Button
                      //   variant="contained"
                      //   color="primary"
                      //   size="large"
                      //   startIcon={<AddCircleIcon />}
                      //   ref={addActionRef}
                      //   onClick={props.action.onClick}
                      // >
                      //   Add team member
                      // </Button>
                    );
                  }
                },
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
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      projectActions.add(newData);

                      //setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      projectActions.update(newData, oldData);

                      //setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      projectActions.delete(oldData);

                      //setTimeout(() => refetch(), 501);
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
                    console.log(
                      "newValue: " + newValue,
                      oldValue,
                      rowData,
                      columnDef
                    );
                    setTimeout(resolve, 1000);
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
