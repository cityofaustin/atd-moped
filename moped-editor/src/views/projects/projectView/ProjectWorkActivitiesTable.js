import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { Alert } from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
  MTableToolbar,
} from "@material-table/core";
import typography from "../../../theme/typography";

import { currencyFormatter } from "../../../utils/numberFormatters";
import DollarAmountIntegerField from "./DollarAmountIntegerField";

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

const DEFAULT_SNACKBAR_STATE = {
  open: false,
  message: null,
  severity: "success",
};

const useStyles = makeStyles((theme) => ({
  addRecordButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
}));

const ProjectWorkActivitiesTable = () => {
  const [editId, setEditId] = useState(null);
  const classes = useStyles();
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(WORK_ACTIVITY_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const [addContract] = useMutation(ADD_CONTRACT);
  const [updateContract] = useMutation(UPDATE_CONTRACT);
  const [deleteContract] = useMutation(DELETE_CONTRACT);

  if (loading || !data) return <CircularProgress />;

  const stuff = data?.moped_proj_work_activity;

  return (
    <ApolloErrorHandler errors={error}>
      <Grid>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            color="primary"
            style={{ paddingTop: "1em" }}
          >
            Work Activity
          </Typography>
        </Grid>
        {stuff?.map((activity) => (
          <Grid item xs={12}>
            {activity.id === editId ? (
              <WorkActivityCardEdit activity={activity} setEditId={setEditId} />
            ) : (
              <WorkActivityCard activity={stuff?.[0]} setEditId={setEditId} />
            )}
          </Grid>
        ))}
      </Grid>
    </ApolloErrorHandler>
  );
};

export default ProjectWorkActivitiesTable;
