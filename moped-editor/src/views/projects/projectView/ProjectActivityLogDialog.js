import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  Typography,
  Toolbar,
  Icon,
  Grid,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import {
  getRecordTypeLabel,
  getHumanReadableField,
} from "./ProjectActivityLogTableMaps";

import { PROJECT_ACTIVITY_LOG_DETAILS } from "../../../queries/project";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    padding: "0",
  },
  diffTitle: {
    padding: "1rem 0",
  },
  eventDetail: {
    padding: "1rem 0",
    "font-size": "1.5rem",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectActivityLogDialog = ({ activity_id, handleClose }) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG_DETAILS, {
    variables: {
      activityId: activity_id,
    },
  });

  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const getEventData = (data, mode) => {
    return data["moped_activity_log"][0]["record_data"]["event"]["data"][mode];
  };

  const getEventAttribute = (data, field) => {
    return data?.moped_activity_log[0][field] ?? null;
  };

  const getUser = data => {
    try {
      return (
        data.moped_activity_log[0].moped_user.first_name +
        " " +
        data.moped_activity_log[0].moped_user.last_name
      );
    } catch {
      return null;
    }
  };

  const getDateTime = data => {
    const date = data?.moped_activity_log[0]?.created_at;

    try {
      return new Date(date).toLocaleString();
    } catch {
      return null;
    }
  };

  const generateValue = value => {
    return value === null || String(value).trim() === "" ? (
      <span style={{ color: "gray" }}>Null</span>
    ) : (
      <>{value}</>
    );
  };

  const generateFieldList = (data, mode) => {
    const recordState = getEventData(data, mode);
    const diffFieldList = getEventAttribute(data, "description").map(diff => {
      return diff.field;
    });
    const recordType = getEventAttribute(data, "record_type");
    const recordTypeFriendly = getRecordTypeLabel(recordType);
    return (
      <List dense={false}>
        {Object.keys(recordState).map(field => {
          if (showDiffOnly) {
            if (!diffFieldList.includes(field.toLowerCase())) {
              return null;
            }
          }

          return (
            <ListItem key={field}>
              <ListItemAvatar>
                <Avatar>
                  <Icon>info</Icon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span
                    style={{
                      color: diffFieldList.includes(field.toLowerCase())
                        ? "red"
                        : "black",
                    }}
                  >
                    {generateValue(recordState[field])}
                  </span>
                }
                secondary={
                  <span style={{ color: "gray" }}>
                    {recordTypeFriendly}{" "}
                    {getHumanReadableField(recordType, field)}
                  </span>
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            Change Details
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "1rem" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                Before Change
              </Typography>
              <Paper elevation={3} className={classes.paper}>
                {generateFieldList(data, "old")}
              </Paper>
              <Button
                style={{ "margin-top": "1rem" }}
                variant="contained"
                color="primary"
                onClick={handleClose}
                fullWidth
              >
                Revert to this "old" version
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                After Change
              </Typography>
              <Paper elevation={3} className={classes.paper}>
                {generateFieldList(data, "new")}
              </Paper>
              <Button
                style={{ "margin-top": "1rem" }}
                variant="contained"
                color="primary"
                onClick={handleClose}
                fullWidth
              >
                Revert to this "new" version
              </Button>
            </Grid>
            <Grid elevation={3} item xs={4}>
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                Options
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDiffOnly}
                    onChange={() => setShowDiffOnly(!showDiffOnly)}
                    name="diffOnly"
                  />
                }
                label="Show Differences Only"
              />
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                Details
              </Typography>
              <Typography variant="button" display="block" gutterBottom>
                Record Type:{" "}
                {getRecordTypeLabel(getEventAttribute(data, "record_type"))}
              </Typography>
              <Typography variant="button" display="block" gutterBottom>
                User: {getUser(data)}
              </Typography>
              <Typography variant="button" display="block" gutterBottom>
                Action: {getEventAttribute(data, "operation_type")}
              </Typography>
              <Typography variant="button" display="block" gutterBottom>
                Timestamp: {getDateTime(data)}
              </Typography>

              <Button
                style={{ "margin-top": "1rem" }}
                onClick={handleClose}
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        )}
        {error && <div>{error}</div>}
      </div>
    </Dialog>
  );
};

export default ProjectActivityLogDialog;
