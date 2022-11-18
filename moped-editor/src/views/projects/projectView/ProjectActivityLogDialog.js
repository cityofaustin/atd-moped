import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useActivityLogLookupTables } from "../../../utils/activityLogHelpers";

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
import {
  formatTimeStampTZType,
  makeFullTimeFromTimeStampTZ,
} from "src/utils/dateAndTime";
import { getUserFullName } from "src/utils/userNames";

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
  listItem: {
    padding: ".5rem 1rem 1rem 1.5rem",
  },
  listColorRed: {
    color: "red",
  },
  listColorGray: {
    color: "gray",
  },
  listColorBlack: {
    color: "black",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectActivityLogDialog = ({ activity_id, handleClose }) => {
  const classes = useStyles();

  const {
    getLookups,
    lookupLoading,
    lookupError,
    lookupMap,
  } = useActivityLogLookupTables();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG_DETAILS, {
    variables: {
      activityId: activity_id,
    },
    onCompleted: data => getLookups(data, "activity_log_lookup_tables"),
  });

  const [showDiffOnly, setShowDiffOnly] = useState(true);

  const getEventData = (data, mode) => {
    // the original schema
    if (data["moped_activity_log"][0]["record_data"]["event"]) {
      return data["moped_activity_log"][0]["record_data"]["event"]["data"][mode];
    }
    return data["moped_activity_log"][0]["record_data"]["data"][mode];
  };

  const getEventAttribute = (data, field) => {
    return data?.moped_activity_log[0][field] ?? null;
  };

  const getUser = data => {
    try {
      const moped_user = data.moped_activity_log[0].moped_user ?? data.moped_activity_log[0].updated_by_user
      return getUserFullName(moped_user);
    } catch {
      return null;
    }
  };

  const getDateTime = data => {
    const timestamptz = data?.moped_activity_log[0]?.created_at;

    try {
      return `${formatTimeStampTZType(
        timestamptz
      )}, ${makeFullTimeFromTimeStampTZ(timestamptz)}`;
    } catch {
      return null;
    }
  };

  /**
   * Get lookup value by table name, field, and primary key value from lookup map or return null
   * @param {string} value - The primary key id from the lookup table
   * @param {string} field - The name from the lookup table
   * @param {string} recordType - The table name of the lookup table
   * @return {string|null} The value translated through the lookup table or null if not found
   */
  const generateLookupValue = (value, field, recordType) =>
    lookupMap?.[recordType]?.[field]?.[value] || null;

  const generateValue = value => {
    return value === null || String(value).trim() === "" ? (
      <span className={classes.listColorGray}>Null</span>
    ) : (
      <>{String(value)}</>
    );
  };

  const generateFieldList = (data, mode) => {
    const recordState = getEventData(data, mode);
    const diffFieldList = getEventAttribute(data, "description").map(diff => {
      return diff.field;
    });
    const recordType = getEventAttribute(data, "record_type");
    const recordTypeFriendly = getRecordTypeLabel(recordType);
    if (recordState === null) {
      return null;
    }

    return (
      <List dense={false}>
        {Object.keys(recordState).map(field => {
          if (showDiffOnly) {
            if (!diffFieldList.includes(field.toLowerCase())) {
              return null;
            }
          }

          return (
            <ListItem key={field} className={classes.listItem}>
              <ListItemAvatar>
                <Avatar>
                  <Icon>info</Icon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span
                    className={
                      diffFieldList.includes(field.toLowerCase())
                        ? classes.listColorRed
                        : classes.listColorBlack
                    }
                  >
                    {generateLookupValue(
                      recordState[field],
                      field,
                      recordType
                    ) || generateValue(recordState[field])}
                  </span>
                }
                secondary={
                  <span className={classes.listColorGray}>
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

  /**
   * Switch off diff if the operation is not update
   */
  useEffect(() => {
    if (data && data?.moped_activity_log[0]["operation_type"] !== "UPDATE") {
      setShowDiffOnly(false);
    }
  }, [showDiffOnly, data]);

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
        {loading || lookupLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                Before
              </Typography>
              <Paper elevation={3} className={classes.paper}>
                {generateFieldList(data, "old")}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h4"
                component="h2"
                className={classes.diffTitle}
              >
                After
              </Typography>
              <Paper elevation={3} className={classes.paper}>
                {generateFieldList(data, "new")}
              </Paper>
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

              <List dense={false}>
                <ListItem>
                  <ListItemText
                    primary={
                      <span className={classes.listColorBlack}>
                        {getRecordTypeLabel(
                          getEventAttribute(data, "record_type")
                        )}
                      </span>
                    }
                    secondary={
                      <span className={classes.listColorGray}>Record Type</span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <span className={classes.listColorBlack}>
                        {getUser(data)}
                      </span>
                    }
                    secondary={
                      <span className={classes.listColorGray}>User</span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <span className={classes.listColorBlack}>
                        {getEventAttribute(data, "operation_type")}
                      </span>
                    }
                    secondary={
                      <span className={classes.listColorGray}>Action</span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <span className={classes.listColorBlack}>
                        {getDateTime(data)}
                      </span>
                    }
                    secondary={
                      <span className={classes.listColorGray}>Timestamp</span>
                    }
                  />
                </ListItem>
              </List>

              <Button
                style={{ "margin-top": "1rem" }}
                onClick={handleClose}
                fullWidth
              >
                Close
              </Button>
            </Grid>
          </Grid>
        )}
        {error && <div>{error}</div>}
        {lookupError && <div>{lookupError}</div>}
      </div>
    </Dialog>
  );
};

export default ProjectActivityLogDialog;
