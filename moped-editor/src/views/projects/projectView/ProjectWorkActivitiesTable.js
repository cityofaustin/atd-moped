import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Typography,
  Grid,
  Icon,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import WorkActivityCard from "./WorkActivityCard";
import WorkActivityCardEdit from "./WorkActivityCardEdit";
// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  WORK_ACTIVITY_QUERY,
  UPDATE_CONTRACT,
  ADD_CONTRACT,
  DELETE_CONTRACT,
} from "../../../queries/funding";

const useStyles = makeStyles((theme) => ({
  addRecordButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
}));

const ProjectWorkActivitiesTable = () => {
  const [isAddingNewActivity, setIsAddingNewActivity] = useState(false);
  const [editId, setEditId] = useState(null);
  const classes = useStyles();
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(WORK_ACTIVITY_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  // const [addContract] = useMutation(ADD_CONTRACT);
  // const [updateContract] = useMutation(UPDATE_CONTRACT);
  // const [deleteContract] = useMutation(DELETE_CONTRACT);

  if (loading || !data) return <CircularProgress />;

  const stuff = data?.moped_proj_work_activity;

  return (
    <ApolloErrorHandler errors={error}>
      <Grid
        container
        justifyContent="space-between"
        direction="row"
        alignItems="center"
      >
        <Grid item>
          <Typography
            variant="h2"
            color="primary"
            style={{ paddingTop: "1em", paddingBottom: "1em" }}
          >
            Work Activities
          </Typography>
        </Grid>
        {!isAddingNewActivity && !editId && (
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              startIcon={<Icon>add_circle</Icon>}
              onClick={() => setIsAddingNewActivity(true)}
            >
              New Activity
            </Button>
          </Grid>
        )}
        {isAddingNewActivity && (
          <Grid item xs={12}>
            <WorkActivityCardEdit
              activity={null}
              onCancel={() => setIsAddingNewActivity(false)}
            />
          </Grid>
        )}
        {stuff?.map((activity) => (
          <Grid item xs={12}>
            {activity.id === editId ? (
              <WorkActivityCardEdit
                activity={activity}
                onCancel={() => setEditId(false)}
              />
            ) : (
              <WorkActivityCard
                activity={stuff?.[0]}
                onEdit={() => setEditId(activity.id)}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </ApolloErrorHandler>
  );
};

export default ProjectWorkActivitiesTable;
