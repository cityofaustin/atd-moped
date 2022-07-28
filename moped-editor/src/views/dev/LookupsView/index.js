import React, { createRef, useMemo, useEffect, useState } from "react";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useQuery } from "@apollo/client";
import { useLocation, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import { makeStyles } from "@material-ui/styles";
import Page from "src/components/Page";
import RecordTable from "./RecordTable";
import { TIMELINE_LOOKUPS_QUERY } from "src/queries/timelineLookups";
import { SETTINGS } from "./settings";

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(3),
  },
}));

/**
 * Converts a record key (e.g. moped_phases) into a URL hash, (e.g. #moped-phases)
 */
const createRecordKeyHash = (recordKey) => `#${recordKey.replace("_", "-")}`;

/**
 * Page component which renders various Moped record types.
 * To add a table to this page:
 * 1. Add an entry to the ./settings/SETTINGS array with the appropriate definitions
 * 2. Update the query that powers this view to include your data
 * @returns { JSX } a page component
 */
const LookupsView = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(TIMELINE_LOOKUPS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const [selectedRecordKey, setSelectedRecordKey] = useState(null);

  /**
   * We're using history here (and elsewhere) because it's not possible to use react-router
   * to replace window.loctation w/o forcing a re-render.
   * See // https://github.com/remix-run/react-router/issues/8908
   */
  const history = createBrowserHistory();

  /**
   * Create a ref index for every table element on the page so that we can scroll to them
   * */
  const refs = useMemo(
    () =>
      SETTINGS.reduce((prev, recordType) => {
        prev[recordType.key] = createRef();
        return prev;
      }, {}),
    []
  );

  /**
   * Use the record hash from the URL, if present. This only happens on page load.
   * */
  const { hash: recordKeyHash } = useLocation();
  useEffect(() => {
    if (!recordKeyHash) {
      return;
    }
    const recordKey = recordKeyHash.replace("#", "").replace("-", "_");
    setSelectedRecordKey(recordKey);
  }, [recordKeyHash]);

  /**
   * Listens for changes to the selected record key and scrolls to its table
   */
  useEffect(() => {
    if (!selectedRecordKey) {
      return;
    }
    const ref = refs?.[selectedRecordKey];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRecordKey, refs]);

  if (loading) return <CircularProgress />;

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Moped lookup values">
        <Container maxWidth="xl">
          <Grid container spacing={3} className={classes.topMargin}>
            <Grid item xs={12}>
              <Typography variant="h1">Moped lookup values</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.topMargin}></Grid>
          {SETTINGS.map((recordType) => (
            <Grid
              container
              spacing={3}
              className={classes.topMargin}
              component={Paper}
              key={recordType.key}
              ref={refs[recordType.key]}
            >
              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Typography variant="h2">{recordType.label}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      component={Link}
                      to={createRecordKeyHash(recordType.key)}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedRecordKey(recordType.key);
                        history.replace(createRecordKeyHash(recordType.key));
                      }}
                    >
                      <LinkIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <RecordTable
                      rows={data[recordType.key]}
                      columns={recordType.columns}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Container>
      </Page>
    </ApolloErrorHandler>
  );
};

export default LookupsView;
