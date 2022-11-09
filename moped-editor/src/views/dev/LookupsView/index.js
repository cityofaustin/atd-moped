import React, { createRef, useMemo, useEffect } from "react";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useQuery } from "@apollo/client";
import { useLocation, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import LinkIcon from "@material-ui/icons/Link";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { makeStyles } from "@material-ui/styles";
import Page from "src/components/Page";
import RecordTable from "./RecordTable";
import { TABLE_LOOKUPS_QUERY } from "src/queries/tableLookups";
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
 * Scroll to a page element based on its key
 */
const scrollToTable = (recordKey, refs) => {
  const ref = refs?.[recordKey];
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Page component which renders various Moped record types.
 * To add a table to this page:
 * 1. Add an entry to the ./settings/SETTINGS array with the appropriate definitions
 * 2. Update the query that powers this view to include your data
 * @returns { JSX } a page component
 */
const LookupsView = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(TABLE_LOOKUPS_QUERY, {
    fetchPolicy: "no-cache",
  });

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
      SETTINGS.reduce(
        (prev, recordType) => {
          prev[recordType.key] = createRef();
          return prev;
        },
        { _scroll_to_top: createRef() }
      ),
    []
  );

  /**
   * Use the record hash from the URL, if present. This only happens once after
   * data fetch.
   * */
  const { hash: recordKeyHash } = useLocation();
  useEffect(() => {
    if (!recordKeyHash || loading) {
      return;
    }
    const recordKey = recordKeyHash.replace("#", "").replace("-", "_");
    scrollToTable(recordKey, refs);
  }, [recordKeyHash, loading, refs]);

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Moped Data Dictionary">
        <Container maxWidth="xl">
          <Grid container spacing={3} className={classes.topMargin}>
            <Grid item xs={12}>
              <Typography variant="h1">Moped Data Dictionary</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            className={classes.topMargin}
            component={Paper}
            ref={refs._scroll_to_top}
          >
            {SETTINGS.map((recordType) => (
              <Grid item key={recordType.key}>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={createRecordKeyHash(recordType.key)}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTable(recordType.key, refs);
                    history.replace(createRecordKeyHash(recordType.key));
                  }}
                >
                  {recordType.label}
                </Button>
              </Grid>
            ))}
          </Grid>
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
                    <Tooltip title="Link to this table">
                      <IconButton
                        component={Link}
                        to={createRecordKeyHash(recordType.key)}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTable(recordType.key, refs);
                          history.replace(createRecordKeyHash(recordType.key));
                        }}
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Return to top of page">
                      <IconButton
                        component={Link}
                        to={"#"}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTable("_scroll_to_top", refs);
                          history.replace("");
                        }}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <RecordTable
                      rows={data?.[recordType.key]}
                      columns={recordType.columns}
                      loading={loading}
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
