import React, { useEffect, useState } from "react";

// Material
import { makeStyles } from "@material-ui/core";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography,
} from "@material-ui/core";
import MaterialTable from "material-table";

// Query
import { TIMELINE_QUERY } from "../../../queries/project";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

const ProjectTimeline = () => {
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const columns = [
    { title: "Phase Name", field: "phase_name" },
    {
      title: "Active?",
      field: "is_current_phase",
    },
    { title: "Start Date", field: "phase_start" },
    { title: "End Date", field: "phase_end" },
  ];

  console.log("tk", data);

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              columns={columns}
              data={data.moped_proj_phases}
              title="Project Phases"
              editable={{
                // isEditable: rowData => rowData.name === "phase_name",
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      console.log(newData);
                      resolve();
                    }, 1000);
                  }),
                // onRowAdd: newData =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       setData([...data, newData]);

                //       resolve();
                //     }, 1000);
                //   }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      console.log("newData", newData);
                      console.log("oldData", oldData);
                      resolve();
                    }, 1000);
                  }),
                // onRowUpdate: (newData, oldData) =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       const dataUpdate = [...data];
                //       const index = oldData.tableData.id;
                //       dataUpdate[index] = newData;
                //       setData([...dataUpdate]);

                //       resolve();
                //     }, 1000);
                //   }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      console.log(oldData);

                      resolve();
                    }, 1000);
                  }),
                // onRowDelete: oldData =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       const dataDelete = [...data];
                //       const index = oldData.tableData.id;
                //       dataDelete.splice(index, 1);
                //       setData([...dataDelete]);

                //       resolve();
                //     }, 1000);
                //   }),
              }}
            />
          </div>
          <Button
            color="primary"
            variant="contained"
            // component={RouterLink}
            // to={"/moped/projects/new"}
            startIcon={<Icon>add_circle</Icon>}
          >
            New Phase
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
