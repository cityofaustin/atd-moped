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
import { NAMES } from "./settings";

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(3),
  },
}));

const LookupsView = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(TIMELINE_LOOKUPS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const recordNames = data ? Object.keys(data) : null;
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
          {recordNames &&
            recordNames.map((name) => (
              <Grid
                container
                spacing={3}
                className={classes.topMargin}
                component={Paper}
                key={name}
              >
                <Grid item xs={12}>
                  <Typography variant="h2">{NAMES[name]}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <RecordTable rows={data[name]} name={name} />
                </Grid>
              </Grid>
            ))}
        </Container>
      </Page>
    </ApolloErrorHandler>
  );
};

export default LookupsView;
