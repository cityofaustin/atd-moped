import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CardContent,
  Checkbox,
  CircularProgress,
  Grid,
  Input,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MaterialTable, {
  MTableEditRow,
  MTableEditField,
} from "@material-table/core";
import parse from "html-react-parser";

import Page from "src/components/Page";
import { useWindowResize } from "src/utils/materialTableHelpers.js";
import typography from "../../../theme/typography";
import { formatDateType, formatTimeStampTZType } from "src/utils/dateAndTime";
import {
  SIGNAL_PROJECTS_QUERY,
  UPDATE_SIGNAL_PROJECT,
} from "../../../queries/signals";
import {
  PROJECT_UPDATE_SPONSOR,
  PROJECT_UPDATE_TYPES,
  UPDATE_PROJECT_TASK_ORDER,
} from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import RenderFieldLink from "./RenderFieldLink";
import RenderSignalLink from "./RenderSignalLink";
import TaskOrderAutocomplete from "./TaskOrderAutocomplete";
import { getUserFullName } from "src/utils/userNames";

const useStyles = makeStyles({
  tableTypography: {
    fontSize: "14px",
  },
});

const SignalProjectTable = () => {
  const classes = useStyles();
  const { height } = useWindowResize();
  const { loading, error, data, refetch } = useQuery(SIGNAL_PROJECTS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const [updateSignalProject] = useMutation(UPDATE_SIGNAL_PROJECT);
  const [updateProjectSponsor] = useMutation(PROJECT_UPDATE_SPONSOR);
  const [updateProjectTypes] = useMutation(PROJECT_UPDATE_TYPES);
  const [updateProjectTaskOrder] = useMutation(UPDATE_PROJECT_TASK_ORDER);

  if (error) {
    console.log(error);
  }
  if (loading || !data) {
    return <CircularProgress />;
  }

  // lists needed for dropdown options
  const entityList = data?.moped_entity ?? [];
  const typeList = data?.moped_types ?? [];
  const typeDict = typeList.reduce(
    (prev, curr) => ({
      ...prev,
      ...{ [curr.type_id]: curr.type_name },
    }),
    {}
  );

  /**
   * Build data needed in Signals Material Table
   */
  data.moped_project.forEach((project) => {
    // project status update equivalent to most recent project note
    project["status_update"] = "";
    if (project?.moped_proj_notes?.length) {
      const note = project.moped_proj_notes[0]["project_note"];
      // Remove any HTML tags
      project["status_update"] = note ? parse(String(note)) : "";
    }

    // Signal IDs
    const signal_ids = [];
    if (project?.moped_proj_components.length) {
      project.moped_proj_components.forEach((projectComponent) => {
        projectComponent.moped_proj_features.forEach((projectFeature) => {
          const signal = projectFeature?.feature?.properties?.signal_id;
          if (signal) {
            signal_ids.push({
              signal_id: signal,
              knack_id: projectFeature.feature.properties.id,
            });
          }
        });
      });
    }

    project["signal_ids"] = signal_ids;

    // moped project types
    const project_types = [];
    if (project?.moped_project_types?.length) {
      project.moped_project_types.forEach((projType) => {
        project_types.push(projType?.moped_type?.type_id);
      });
    }
    project["project_types"] = project_types;

    // project sponsor
    project["project_sponsor_object"] = entityList.find(
      (e) => e.entity_id === project?.project_sponsor
    );

    // Targeted Construction Start > moped_proj_phases where phase = Construction,
    // display the phase start date, otherwise leave blank
    project["construction_start"] = null;
    project["completion_date"] = null;
    project["current_phase"] = "";
    if (project?.moped_proj_phases?.length) {
      // check for construction phase
      const constructionPhase = project.moped_proj_phases.find(
        (p) => p.phase_id === 9 // 9 is the phase_id for Construction
      );
      if (constructionPhase) {
        project["construction_start"] = constructionPhase.phase_start;
      }
      // check for completion phase
      const completionPhase = project.moped_proj_phases.find(
        (p) => p.phase_id === 11 // 11 is phase_id for complete
      );
      if (completionPhase) {
        project["completion_date"] = completionPhase.phase_end;
      }
      // get current phase
      const currentPhase = project.moped_proj_phases.find(
        (p) => p.is_current_phase
      );
      if (currentPhase) {
        project["current_phase"] =
          currentPhase.moped_phase.phase_name.charAt(0).toUpperCase() +
          currentPhase.moped_phase.phase_name.slice(1);
      }
    }

    // funding source
    const funding_sources = [];
    if (project?.moped_proj_funding?.length) {
      project.moped_proj_funding.forEach((source) => {
        funding_sources.push(source?.moped_fund_source?.funding_source_name);
      });
    }
    project["funding_sources"] = funding_sources;

    // project personnel
    const designers = [];
    const inspectors = [];
    // role_ids come from moped_project_roles. 8 is Designer and 12 is Inspector
    const isDesigner = (personnel) =>
      personnel?.moped_proj_personnel_roles.find(
        (role) => role.project_role_id === 8
      );
    const isInspector = (personnel) =>
      personnel?.moped_proj_personnel_roles.find(
        (role) => role.project_role_id === 12
      );
    if (project?.moped_proj_personnel?.length) {
      project.moped_proj_personnel.forEach((personnel) => {
        if (isDesigner(personnel)) {
          designers.push(getUserFullName(personnel.moped_user));
        }
        if (isInspector(personnel)) {
          inspectors.push(getUserFullName(personnel.moped_user));
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
      cellStyle: { ...typographyStyle, minWidth: "200px" },
      render: (entry) => (
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
      customFilterAndSearch: (term, rowData) => {
        const displaySignals = rowData.signal_ids
          .map((s) => s.signal_id)
          .join(" ");
        return displaySignals.includes(term);
      },
      render: (entry) => <RenderSignalLink signals={entry.signal_ids} />,
    },
    {
      title: "Project types",
      field: "project_types",
      customEdit: "projectTypes",
      customFilterAndSearch: (term, rowData) => {
        const displayProjectTypes = rowData.project_types
          .map((t) => typeDict[t])
          .join(" ");
        return displayProjectTypes.toUpperCase().includes(term.toUpperCase());
      },
      render: (entry) => {
        if (entry?.project_types?.length) {
          return (
            <Typography
              className={classes.tableTypography}
              style={{ maxWidth: "155px" }}
            >
              {entry.project_types.map((t) => typeDict[t]).join(", ")}
            </Typography>
          );
        }
        return <Typography className={classes.tableTypography}>-</Typography>;
      },
    },
    {
      title: "Current phase",
      field: "current_phase",
      editable: "never",
      cellStyle: typographyStyle,
      render: (entry) => (
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
      customEdit: "taskOrders",
      emptyValue: "-",
      customFilterAndSearch: (term, rowData) => {
        const displayTaskOrders = rowData.task_order
          ? rowData.task_order
              .map((taskOrder) => taskOrder.display_name)
              .join(" ")
          : "";
        return displayTaskOrders.toUpperCase().includes(term.toUpperCase());
      },
      render: (entry) => {
        // Empty value won't work in some cases where task_order is an empty array.
        if (entry.task_order.length < 1) {
          return "-";
        }
        // Render values as a comma seperated string
        let content = entry.task_order
          .map((taskOrder) => {
            return taskOrder.display_name;
          })
          .join(", ");

        return <div style={{ maxWidth: "265px" }}>{content}</div>;
      },
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
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.funding_sources.join(", ")}
          tab="funding"
        />
      ),
    },
    {
      title: "Project sponsor",
      field: "project_sponsor_object",
      customFilterAndSearch: (term, rowData) => {
        return rowData.project_sponsor_object.entity_name
          .toUpperCase()
          .includes(term.toUpperCase());
      },
      render: (entry) => (
        <Typography className={classes.tableTypography}>
          {entry?.project_sponsor_object?.entity_name === "None"
            ? "-"
            : entry?.project_sponsor_object?.entity_name}
        </Typography>
      ),
      customEdit: "projectSponsor",
    },
    {
      title: "Designer",
      field: "project_designer",
      cellStyle: typographyStyle,
      editable: "never",
      render: (entry) => (
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
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_inspector}
          tab="team"
        />
      ),
    },
    {
      title: "Construction start",
      field: "construction_start",
      editable: "never",
      cellStyle: typographyStyle,
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={
            entry.construction_start
              ? formatDateType(entry.construction_start)
              : ""
          }
          tab="timeline"
        />
      ),
    },
    {
      title: "Project completion",
      field: "completion_date",
      editable: "never",
      cellStyle: typographyStyle,
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={
            entry.completion_date ? formatDateType(entry.completion_date) : ""
          }
          tab="timeline"
        />
      ),
    },
    {
      title: "Modified",
      field: "last_modified",
      editable: "never",
      cellStyle: typographyStyle,
      render: (entry) => formatTimeStampTZType(entry.updated_at),
    },
  ];

  /**
   * projectActions functions object
   */
  const projectActions = {
    cellUpdate: (newData, oldData, rowData, columnDef) => {
      // if column definition has a custom edit component, use that mutation to update
      if (columnDef.customEdit === "projectSponsor") {
        return updateProjectSponsor({
          variables: {
            projectId: rowData.project_id,
            entityId: newData.entity_id,
          },
        });
      } else if (columnDef.customEdit === "projectTypes") {
        const typeIdsToDelete = oldData.filter((t) => !newData.includes(t));
        const typeIdsToInsert = newData.filter((t) => !oldData.includes(t));
        const typeObjectsToInsert = typeIdsToInsert.map((type_id) => ({
          project_id: rowData.project_id,
          project_type_id: type_id,
        }));
        // List of primary keys to delete
        const typePksToDelete = rowData.moped_project_types
          .filter((t) => typeIdsToDelete.includes(t?.moped_type.type_id))
          .map((t) => t.id);
        return updateProjectTypes({
          variables: {
            types: typeObjectsToInsert,
            deleteList: typePksToDelete,
          },
        });
      } else if (columnDef.customEdit === "taskOrders") {
        return updateProjectTaskOrder({
          variables: {
            taskOrder: newData,
            projectId: rowData.project_id,
          },
        });
      } else {
        const updatedProjectObject = {
          ...rowData,
        };
        updatedProjectObject[columnDef.field] = newData;

        updatedProjectObject["entity_id"] =
          updatedProjectObject?.project_sponsor;

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

  /**
   * Custom edit components
   */
  const cellEditComponents = {
    projectSponsor: (props) => (
      <Autocomplete
        value={props.value ?? "None"}
        defaultValue={"None"}
        options={entityList}
        getOptionLabel={(e) => e.entity_name}
        onChange={(event, value) => props.onChange(value)}
        getOptionSelected={(option, value) =>
          option.entity_id === value.entity_id
        }
        renderInput={(params) => (
          <TextField {...params} variant="standard" label={null} />
        )}
      />
    ),
    projectTypes: (props) => {
      return (
        <Select
          multiple
          value={props.value}
          onChange={(event, value) => props.onChange(event.target.value)} //handleChange}
          input={<Input />}
          renderValue={(type_ids) =>
            type_ids.map((t) => typeDict[t]).join(", ")
          }
          /*
            There appears to be a problem with MenuProps in version 4.x (which is fixed in 5.0),
            this is fixed by overriding the function "getContentAnchorEl".
                Source: https://github.com/mui-org/material-ui/issues/19245#issuecomment-620488016
          */
          MenuProps={{
            getContentAnchorEl: () => null,
            style: {
              maxHeight: 500,
              width: 450,
            },
          }}
        >
          {typeList.map((type) => (
            <MenuItem key={type.type_id} value={type.type_id}>
              <Checkbox
                checked={props.value.includes(type.type_id)}
                color={"primary"}
              />
              <ListItemText primary={type.type_name} />
            </MenuItem>
          ))}
        </Select>
      );
    },
    taskOrders: (props) => (
      <TaskOrderAutocomplete props={props} value={props.value} />
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
                EditRow: (props) => (
                  <MTableEditRow
                    {...props}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                        // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                      }
                    }}
                  />
                ),
                EditField: (props) =>
                  props.columnDef.customEdit ? (
                    cellEditComponents[props.columnDef.customEdit](props)
                  ) : (
                    <MTableEditField {...props} />
                  ),
              }}
              data={data.moped_project}
              title={
                <Typography variant="h1" color="primary">
                  Signal projects
                </Typography>
              }
              options={{
                ...(data.moped_project.length < PAGING_DEFAULT_COUNT + 1 && {
                  paging: false,
                }),
                search: true,
                filtering: true,
                rowStyle: typographyStyle,
                actionsColumnIndex: -1,
                pageSize: 30,
                pageSizeOptions: [10, 30, 100],
                headerStyle: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: 0,
                },
                // maxBodyHeight is used in conjunction with headerStyle position:"sticky"
                // maxBodyHeight is window height minus size of navbar, footer, table title, and table padding
                maxBodyHeight: `${height - 210}px`,
              }}
              localization={{
                header: {
                  actions: "",
                },
              }}
              editable={{
                isEditable: () => false,
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
