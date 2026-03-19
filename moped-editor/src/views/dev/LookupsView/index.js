import React, { createRef, useMemo, useEffect, useState } from "react";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useQuery } from "@apollo/client";
import { useLocation, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Page from "src/components/Page";
import RecordTable from "./RecordTable";
import ComponentTagsTable from "./ComponentTagsTable";
import ProjectTagsTable from "./ProjectTagsTable";
import { TABLE_LOOKUPS_QUERY } from "src/queries/tableLookups";
import { SETTINGS } from "./settings";
import CopyTextButton from "src/components/CopyTextButton";
import FeedbackSnackbar, {
  useFeedbackSnackbar,
} from "src/components/FeedbackSnackbar";
import Can from "src/auth/Can";

/**
 * Converts a record key (e.g. moped_phases) into a URL hash, (e.g. #moped-phases)
 */
const createRecordKeyHash = (recordKey) => `#${recordKey.replaceAll("_", "-")}`;

/**
 * Scroll to a page element based on its key
 */
const scrollToTable = (recordKey, refs) => {
  const ref = refs?.[recordKey];
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

const TAG_TABLE_KEYS = ["moped_component_tags", "moped_tags"];

/**
 * Page component which renders various Moped record types.
 * To add a table to this page:
 * 1. Add an entry to the ./settings/SETTINGS array with the appropriate definitions
 * 2. Update the query that powers this view to include your data
 * Tag tables (component tags, project tags) use DataGridPro with CRUD - admin only for edit.
 * @returns { JSX } a page component
 */
const LookupsView = () => {
  const [componentTagsAddTrigger, setComponentTagsAddTrigger] = useState(0);
  const [projectTagsAddTrigger, setProjectTagsAddTrigger] = useState(0);
  const { snackbarState, handleSnackbar, handleSnackbarClose } =
    useFeedbackSnackbar();
  const { loading, error, data } = useQuery(TABLE_LOOKUPS_QUERY, {
    fetchPolicy: "no-cache",
  });

  /**
   * We're using history here (and elsewhere) because it's not possible to use react-router
   * to replace window.location w/o forcing a re-render.
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
  let { hash: recordKeyHash, pathname } = useLocation();
  useEffect(() => {
    if (!recordKeyHash || loading) {
      return;
    }
    const recordKey = recordKeyHash.replace("#", "").replaceAll("-", "_");
    scrollToTable(recordKey, refs);
  }, [recordKeyHash, loading, refs]);

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Data Dictionary">
        <Container maxWidth="xl">
          <Paper sx={{ paddingLeft: 3 }}>
            <Grid
              container
              spacing={3}
              sx={{ marginTop: 3, scrollMarginTop: 24 }}
              ref={refs._scroll_to_top}
            >
              <Grid item xs={12}>
                <Typography variant="h1" color="primary">
                  Data dictionary
                </Typography>
              </Grid>
              {SETTINGS.map((recordType) => (
                <Grid item key={recordType.key} sx={{ marginBottom: 3 }}>
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
          </Paper>

          {SETTINGS.map((recordType) => (
            <Paper sx={{ px: 3 }} key={recordType.key}>
              <Grid
                container
                spacing={3}
                sx={{ marginTop: 3 }}
                ref={refs[recordType.key]}
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item>
                          <Typography variant="h2">{recordType.label}</Typography>
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
                              size="large"
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <CopyTextButton
                            copyButtonText="Copy link"
                            textToCopy={`${
                              window.location.origin
                            }${pathname}${createRecordKeyHash(recordType.key)}`}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {TAG_TABLE_KEYS.includes(recordType.key) ? (
                      <Grid item>
                        <Can
                          perform="lookups:edit"
                          yes={
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<AddCircleIcon />}
                              onClick={() => {
                                if (recordType.key === "moped_component_tags") {
                                  setComponentTagsAddTrigger((prev) => prev + 1);
                                } else {
                                  setProjectTagsAddTrigger((prev) => prev + 1);
                                }
                              }}
                            >
                              Add tag
                            </Button>
                          }
                          no={null}
                        />
                      </Grid>
                    ) : null}
                  </Grid>
                  <div>
                  {TAG_TABLE_KEYS.includes(recordType.key) ? (
                    <Can
                      perform="lookups:edit"
                      yes={
                        recordType.key === "moped_component_tags" ? (
                          <ComponentTagsTable
                            canEdit={true}
                            handleSnackbar={handleSnackbar}
                            addTrigger={componentTagsAddTrigger}
                          />
                        ) : (
                          <ProjectTagsTable
                            canEdit={true}
                            handleSnackbar={handleSnackbar}
                            addTrigger={projectTagsAddTrigger}
                          />
                        )
                      }
                      no={
                        recordType.key === "moped_component_tags" ? (
                          <ComponentTagsTable
                            canEdit={false}
                            handleSnackbar={handleSnackbar}
                            addTrigger={componentTagsAddTrigger}
                          />
                        ) : (
                          <ProjectTagsTable
                            canEdit={false}
                            handleSnackbar={handleSnackbar}
                            addTrigger={projectTagsAddTrigger}
                          />
                        )
                      }
                    />
                  ) : (
                    <RecordTable
                      rows={data?.[recordType.key]}
                      columns={recordType.columns}
                      loading={loading}
                    />
                  )}
                  </div>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Container>
        <FeedbackSnackbar
          snackbarState={snackbarState}
          handleSnackbarClose={handleSnackbarClose}
        />
      </Page>
    </ApolloErrorHandler>
  );
};

export default LookupsView;
