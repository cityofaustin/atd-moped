import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MaterialTable, { MTableEditRow, MTableEditField } from "material-table";

import Page from "src/components/Page";
import typography from "../../../theme/typography";
import {
  SIGNAL_PROJECTS_QUERY,
  UPDATE_SIGNAL_PROJECT,
} from "../../../queries/signals";
import { PROJECT_UPDATE_SPONSOR } from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import RenderFieldLink from "./RenderFieldLink";
import RenderSignalLink from "./RenderSignalLink";

const useStyles = makeStyles({
  signalsTable: {
    "& .MuiTableCell-root": {
      // override the default padding of 16px
      padding: "14px",
    },
  },
  tableTypography: {
    fontSize: "14px",
  },
});

const SignalProjectTable = () => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const [updateSignalProject] = useMutation(UPDATE_SIGNAL_PROJECT);
  const [updateProjectSponsor] = useMutation(PROJECT_UPDATE_SPONSOR);

  if (error) {
    console.log(error);
  }
  if (loading || !data) {
    return <CircularProgress />;
  }

  const entityList = data?.moped_entity ?? [];

  /**
   * Build data needed in Signals Material Table
   */
  data.moped_project.forEach(project => {
    // project status update equivalent to most recent project note
    project["status_update"] = "";
    if (project?.moped_proj_notes?.length) {
      const note = project.moped_proj_notes[0]["project_note"];
      // Remove any HTML tags
      project["status_update"] = note
        ? String(note).replace(/(<([^>]+)>)/gi, "")
        : "";
    }

    // Signal IDs
    const signal_ids = [];
    if (project?.moped_proj_features.length) {
      project.moped_proj_features.forEach(feature => {
        const signal = feature?.location?.properties?.signal_id;
        if (signal) {
          signal_ids.push({
            signal_id: signal,
            knack_id: feature.location.properties.id,
          });
        }
      });
    }
    project["signal_ids"] = signal_ids;

    // moped project types
    const project_types = [];
    if (project?.moped_project_types?.length) {
      project.moped_project_types.forEach(projType => {
        project_types.push(projType?.moped_type?.type_name);
      });
    }
    project["project_types"] = project_types;

    // project sponsor
    project["project_sponsor"] = entityList.find(
      e => e.entity_id === project?.project_sponsor
    );

    // Targeted Construction Start > moped_proj_phases where phase = Construction,
    // display the phase start date, otherwise leave blank
    project["construction_start"] = null;
    project["completion_date"] = null;
    project["current_phase"] = "";
    if (project?.moped_proj_phases?.length) {
      // check for construction phase
      const constructionPhase = project.moped_proj_phases.find(
        p => p.phase_name === "construction"
      );
      if (constructionPhase) {
        project["construction_start"] = constructionPhase.phase_start;
      }
      // check for completion phase
      const completionPhase = project.moped_proj_phases.find(
        p => p.phase_name === "complete"
      );
      if (completionPhase) {
        project["completion_date"] = completionPhase.phase_end;
      }
      // get current phase
      const currentPhase = project.moped_proj_phases.find(
        p => p.is_current_phase
      );
      if (currentPhase) {
        project["current_phase"] =
          currentPhase.phase_name.charAt(0).toUpperCase() +
          currentPhase.phase_name.slice(1);
      }
    }

    // funding source
    const funding_sources = [];
    if (project?.moped_proj_funding?.length) {
      project.moped_proj_funding.forEach(source => {
        funding_sources.push(source?.moped_fund_source?.funding_source_name);
      });
    }
    project["funding_sources"] = funding_sources;

    // project personnel
    const designers = [];
    const inspectors = [];
    // role_ids come from moped_project_roles. 8 is Designer and 12 is Inspector
    const isDesigner = personnel => personnel?.role_id === 8;
    const isInspector = personnel => personnel?.role_id === 12;
    if (project?.moped_proj_personnel?.length) {
      project.moped_proj_personnel.forEach(personnel => {
        if (isDesigner(personnel)) {
          designers.push(
            `${personnel?.moped_user?.first_name} ${personnel?.moped_user?.last_name}`
          );
        }
        if (isInspector(personnel)) {
          inspectors.push(
            `${personnel?.moped_user?.first_name} ${personnel?.moped_user?.last_name}`
          );
        }
      });
    }
    project["project_designer"] = designers.join(", ");
    project["project_inspector"] = inspectors.join(", ");
  });

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Project name",
      field: "project_name",
      editable: "never",
      cellStyle: { minWidth: "200px" },
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_name}
        />
      ),
    },
    {
      title: "Signal IDs",
      field: "signal_ids",
      editable: "never",
      // cell style font needs to be set if editable is never
      cellStyle: typographyStyle,
      render: entry => <RenderSignalLink signals={entry.signal_ids} />,
    },
    {
      title: "Project types",
      field: "project_types",
      editable: "never",
      render: entry => entry.project_types.join(", "),
    },
    {
      title: "Current phase",
      field: "current_phase",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.current_phase}
          tab="timeline"
        />
      ),
    },
    {
      title: "Task order",
      field: "task_order",
      // placeholder for task order issue
    },
    {
      title: "Contractor/Contract",
      field: "contractor",
      emptyValue: "blank",
      render: entry => (entry.contractor === "" ? "blank" : entry.contractor),
    },
    {
      title: "Status update",
      field: "status_update", // Status update (from Project details page)
      editable: "never",
      cellStyle: { ...typographyStyle, minWidth: "300px" },
    },
    {
      title: "Funding source",
      field: "funding_sources",
      cellStyle: typographyStyle,
      editable: "never",
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.funding_sources.join(", ")}
          tab="funding"
        />
      ),
    },
    {
      title: "Project DO#",
      field: "purchase_order_number",
      emptyValue: "blank",
    },
    {
      title: "Project sponsor",
      field: "project_sponsor",
      render: entry => (
        <Typography className={classes.tableTypography}>
          {entry?.project_sponsor?.entity_name}
        </Typography>
      ),
      customEdit: "projectSponsor",
    },
    {
      title: "Designer",
      field: "project_designer",
      cellStyle: typographyStyle,
      editable: "never",
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_designer}
          tab="team"
        />
      ),
    },
    {
      title: "Inspector",
      field: "project_inspector",
      cellStyle: typographyStyle,
      editable: "never",
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_inspector}
          tab="team"
        />
      ),
    },
    {
      title: "Targeted construction start",
      field: "construction_start",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={
            entry.construction_start
              ? new Date(entry.construction_start).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })
              : ""
          }
          tab="timeline"
        />
      ),
    },
    {
      title: "Project completion date",
      field: "completion_date",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={
            entry.completion_date
              ? new Date(entry.completion_date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })
              : ""
          }
          tab="timeline"
        />
      ),
    },
    {
      title: "Last modified",
      field: "last_modified",
      editable: "never",
      cellStyle: typographyStyle,
      render: entry =>
        new Date(entry.updated_at).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }),
    },
  ];

  const projectActions = {
    update: (newData, oldData) => {
      // initialize update object with old data
      const updatedProjectObject = {
        ...oldData,
      };
      // Array of differences between new and old data
      let differences = Object.keys(oldData).filter(
        key => oldData[key] !== newData[key]
      );

      // Loop through the differences and assign newData values.
      differences.forEach(diff => {
        updatedProjectObject[diff] = newData[diff];
      });

      // Remove extraneous fields given by MaterialTable that
      // Hasura doesn't need
      delete updatedProjectObject.tableData;
      delete updatedProjectObject.__typename;

      updatedProjectObject["entity_id"] =
        updatedProjectObject.project_sponsor.entity_id;

      return updateSignalProject({
        variables: updatedProjectObject,
      });
    },
    cellUpdate: (newData, oldData, rowData, columnDef) => {
      // if column definition has a custom edit component, use that mutation to update
      if (columnDef.customEdit === "projectSponsor") {
        return updateProjectSponsor({
          variables: {
            projectId: rowData.project_id,
            entityId: newData.entity_id,
          },
        });
      } else {
        const updatedProjectObject = {
          ...rowData,
        };
        updatedProjectObject[columnDef.field] = newData;

        updatedProjectObject["entity_id"] =
          updatedProjectObject.project_sponsor.entity_id;

        // Remove extraneous fields given by MaterialTable that
        // Hasura doesn't need
        delete updatedProjectObject.tableData;
        delete updatedProjectObject.__typename;

        return updateSignalProject({
          variables: updatedProjectObject,
        });
      }
    },
  };

  const cellEditComponents = {
    projectSponsor: props => (
      <Autocomplete
        value={props.value ?? "None"}
        defaultValue={"None"}
        options={entityList}
        getOptionLabel={e => e.entity_name}
        onChange={(event, value) => props.onChange(value)}
        getOptionSelected={(option, value) =>
          option.entity_id === value.entity_id
        }
        renderInput={params => (
          <TextField {...params} variant="standard" label={null} />
        )}
      />
    ),
  };

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Page title={"Signal projects"} className={classes.signalsTable}>
            <MaterialTable
              columns={columns}
              components={{
                EditRow: props => (
                  <MTableEditRow
                    {...props}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                        // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                      }
                    }}
                  />
                ),
                EditField: props =>
                  props.columnDef.customEdit ? (
                    cellEditComponents[props.columnDef.customEdit](props)
                  ) : (
                    <MTableEditField {...props} />
                  ),
              }}
              data={data.moped_project}
              title={
                <Typography variant="h2" color="primary">
                  Signal projects
                </Typography>
              }
              options={{
                ...(data.moped_project.length < PAGING_DEFAULT_COUNT + 1 && {
                  paging: false,
                }),
                search: false,
                rowStyle: typographyStyle,
                actionsColumnIndex: -1,
              }}
              localization={{
                header: {
                  actions: "",
                },
              }}
              editable={{
                onRowUpdate: (newData, oldData) => {
                  return projectActions
                    .update(newData, oldData)
                    .then(() => refetch());
                },
              }}
              cellEditable={{
                cellStyle: { minWidth: "300px" },
                onCellEditApproved: (
                  newValue,
                  oldValue,
                  rowData,
                  columnDef
                ) => {
                  return projectActions
                    .cellUpdate(newValue, oldValue, rowData, columnDef)
                    .then(() => refetch());
                },
              }}
            />
          </Page>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default SignalProjectTable;
