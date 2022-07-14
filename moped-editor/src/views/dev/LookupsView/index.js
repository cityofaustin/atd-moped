import React from "react";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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

  if (loading) return <CircularProgress />;

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Moped timeline entities">
        <Container maxWidth="xl">
          <Grid container spacing={3} className={classes.topMargin}>
            <Grid item xs={12}>
              <Typography variant="h1">Moped lookup values</Typography>
            </Grid>
          </Grid>
          {SETTINGS.map((recordType) => (
            <Grid
              container
              spacing={3}
              className={classes.topMargin}
              component={Paper}
              key={recordType.key}
            >
              <Grid item xs={12}>
                <Typography variant="h2">{recordType.label}</Typography>
              </Grid>
              <Grid item xs={12}>
                <RecordTable
                  rows={data[recordType.key]}
                  columns={recordType.columns}
                />
              </Grid>
            </Grid>
          ))}
        </Container>
      </Page>
    </ApolloErrorHandler>
  );
};

export default LookupsView;
