import React from "react";
import { useQuery, useMutation } from "@apollo/client";
// Material
import { CardContent, Grid, Typography } from "@material-ui/core";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";
import Page from "src/components/Page";

const SignalProjectTable = () => {
  // todo: signal projects query
  // const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
  //   // sending a null projectId will cause a graphql error
  //   // id 0 used when creating a new project, no project personnel will be returned
  //   variables: { projectId: projectId ?? 0 },
  //   fetchPolicy: "no-cache",
  // });

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Project name",
      field: "project_name", // clicking on this should be a link to the project
      render: entry => <Typography>{entry.project_name}</Typography>,
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
    },
  ];

  const data = [
    {
      project_name: "My project",
      signal_ids: 44, // is this a string or number
      project_type: "Signal - Mod",
      current_phase: "",
      task_order: "34FTJSDL:",
      contractor: "Name",
      status_update: "this is a status update",
      funding_source: "2016 Bond - Safety",
      project_do: "190911 13453",
      project_sponsor: "Private Development",
      moped_phase: "10/12/2021",
      last_modified: "10/18/2021",
    },
    {
      project_name: "Your project",
      signal_ids: 66, // is this a string or number
      project_type: "Signal - Mod",
      current_phase: "",
      task_order: "34FTJSDL:",
      contractor: "Name",
      status_update: "this is a status update",
      funding_source: "2016 Bond - Safety",
      project_do: "190911 13453",
      project_sponsor: "Private Development",
      moped_phase: "10/12/2021",
      last_modified: "10/18/2021",
    },
  ];

  console.log(data);

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Page title={"signal view"}>
            <MaterialTable
              columns={columns}
              data={data}
              title={
                <Typography variant="h2" color="primary">
                  Signals Table
                </Typography>
              }
            />
          </Page>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default SignalProjectTable;

/*
return (
    <ApolloErrorHandler errors={error}>
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
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add team member
                </Button>
              );
            }
          },
        }}
        data={
          isNewProject
            ? personnelState
            : Object.keys(personnel).map(item => {
                return personnel[item];
              })
        }
        title={
          <Typography variant="h2" color="primary">
            Project team
          </Typography>
        }
        options={{
          ...(data.moped_proj_personnel.length < PAGING_DEFAULT_COUNT + 1 && {
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
          body: {
            emptyDataSourceMessage: (
              <Typography variant="body1">
                No team members to display
              </Typography>
            ),
          },
        }}
        icons={{ Delete: DeleteOutlineIcon }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].add(newData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].update(newData, oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].delete(oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
        }}
      />
    </ApolloErrorHandler>
  );
};


 */
