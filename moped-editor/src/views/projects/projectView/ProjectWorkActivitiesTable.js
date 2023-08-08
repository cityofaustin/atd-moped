import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Typography,
  Grid,
  Icon,
} from "@mui/material";

import WorkActivityCard from "./WorkActivityCard";
import WorkActivityCardEdit from "./WorkActivityCardEdit";
// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import { WORK_ACTIVITY_QUERY } from "../../../queries/funding";

const ProjectWorkActivitiesTable = () => {
  const [isAddingNewActivity, setIsAddingNewActivity] = useState(false);
  const [editId, setEditId] = useState(null);
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(WORK_ACTIVITY_QUERY, {
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
