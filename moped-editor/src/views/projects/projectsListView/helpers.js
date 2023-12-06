import { useEffect, useMemo, useState } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
import { MTableHeader, MTableToolbar } from "@material-table/core";
import { Box, Link, CircularProgress } from "@mui/material";
import typography from "../../../theme/typography";
import parse from "html-react-parser";
import { formatDateType, formatTimeStampTZType } from "src/utils/dateAndTime";
import Pagination from "../../../components/GridTable/Pagination";
import ExternalLink from "../../../components/ExternalLink";
import ProjectStatusBadge from "../projectView/ProjectStatusBadge";
import RenderSignalLink from "../../../components/RenderSignalLink";
import {
  PROJECT_LIST_VIEW_QUERY_CONFIG,
  DEFAULT_HIDDEN_COLS,
} from "./ProjectsListViewQueryConf";
import theme from "src/theme";

export const filterNullValues = (value) => {
  if (!value || value === "-") {
    return "";
  } else {
    return value;
  }
};

export const filterProjectTeamMembers = (value, view) => {
  if (!value) {
    return "";
  }
  const namesArray = value.split(",");
  const uniqueNames = {};
  namesArray.forEach((person) => {
    const [fullName, projectRole] = person.split(":");
    if (uniqueNames[fullName]) {
      uniqueNames[fullName] = uniqueNames[fullName] + `, ${projectRole}`;
    } else {
      uniqueNames[fullName] = projectRole;
    }
  });
  // if the view is projectsListView, render each team member as a block
  if (view === "projectsListView") {
    return Object.keys(uniqueNames).map((key) => (
      <span key={key} style={{ display: "block" }}>
        {`${key} - ${uniqueNames[key]}`}
      </span>
    ));
  } else {
    const projectTeamMembers = Object.keys(uniqueNames).map(
      (key) => `${key} - ${uniqueNames[key]}`
    );
    return projectTeamMembers.join(", ");
  }
};

export const filterProjectSignals = (value) => {
  if (!value) {
    return "";
  } else {
    return value
      .filter((signal) => signal.signal_id)
      .map((signal) => signal.signal_id)
      .join(", ");
  }
};

export const filterTaskOrderName = (value) => {
  if (!value) {
    return "";
  }
  const taskOrderArray = [];
  value.forEach((value) => {
    taskOrderArray.push(value.display_name);
  });
  return taskOrderArray.join(", ");
};

export const resolveHasSubprojects = (array) => {
  if (array) {
    if (array.length > 0) {
      return "Yes";
    }
  }
  return "No";
};

const filterComponentFullNames = (value) => {
  const componentNamesArray = value.components.split(",");
  return componentNamesArray.map((comp) => (
    <span key={comp} style={{ display: "block" }}>
      {comp}
    </span>
  ));
};

/**
 * Get the user hidden column settings from local storage, clear them of
 * outdated columns, and supplement with remaining default columns
 * @returns {Object} hidden column settings from local storage
 */
const getPreviousHiddenColumns = () => {
  let previousHiddenColumnSettings;

  try {
    previousHiddenColumnSettings = JSON.parse(
      localStorage.getItem("mopedColumnConfig")
    );
  } catch (e) {
    previousHiddenColumnSettings = null;
    console.error("Error parsing project list view hidden column settings", e);
  }

  let currentHiddenColumnSettings;

  // If there are no previous hidden column settings, set the default hidden columns
  if (!previousHiddenColumnSettings) {
    localStorage.setItem(
      "mopedColumnConfig",
      JSON.stringify(DEFAULT_HIDDEN_COLS)
    );

    currentHiddenColumnSettings = DEFAULT_HIDDEN_COLS;
  } else {
    // Use previous settings to override default hidden columns.
    // By iterating the defaults, we also remove outdated columns no longer in config.
    currentHiddenColumnSettings = Object.keys(DEFAULT_HIDDEN_COLS).reduce(
      (acc, columnName) => {
        if (previousHiddenColumnSettings.hasOwnProperty(columnName)) {
          return {
            ...acc,
            [columnName]: previousHiddenColumnSettings[columnName],
          };
        } else {
          return { ...acc, [columnName]: DEFAULT_HIDDEN_COLS[columnName] };
        }
      },
      {}
    );
  }

  return currentHiddenColumnSettings;
};

const COLUMN_CONFIG = PROJECT_LIST_VIEW_QUERY_CONFIG.columns;

/**
 * Various custom components for Material Table
 */
export const useTableComponents = ({
  data,
  loading,
  queryLimit,
  queryOffset,
  setQueryLimit,
  setQueryOffset,
  handleTableHeaderClick,
  sortByColumnIndex,
  orderByDirection,
  rowsPerPageOptions,
}) =>
  useMemo(
    () => ({
      Pagination: (props) => (
        <Pagination
          recordCount={data.project_list_view_aggregate?.aggregate.count}
          queryLimit={queryLimit}
          setQueryLimit={setQueryLimit}
          queryOffset={queryOffset}
          setQueryOffset={setQueryOffset}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      ),
      Header: (props) => (
        <MTableHeader
          {...props}
          onOrderChange={handleTableHeaderClick}
          orderBy={sortByColumnIndex}
          orderDirection={orderByDirection}
        />
      ),
    }),
    [
      data,
      loading,
      queryLimit,
      queryOffset,
      setQueryLimit,
      setQueryOffset,
      handleTableHeaderClick,
      sortByColumnIndex,
      orderByDirection,
      rowsPerPageOptions,
    ]
  );

export const useHiddenColumnsSettings = () => {
  const [hiddenColumns, setHiddenColumns] = useState({});

  /*
   * Initialize hidden columns from previous local storage
   */
  useEffect(() => {
    const initialHiddenColumnSettings = getPreviousHiddenColumns();
    setHiddenColumns(initialHiddenColumnSettings);
  }, []);

  /*
   * Sync hidden columns state with local storage
   */
  useEffect(() => {
    localStorage.setItem("mopedColumnConfig", JSON.stringify(hiddenColumns));
  }, [hiddenColumns]);

  return { hiddenColumns, setHiddenColumns };
};

/**
 * The Material Table column settings
 */
export const useColumns = ({ hiddenColumns }) => {
  const location = useLocation();
  const queryString = location.search;

  const columnsToReturnInQuery = useMemo(() => {
    const columnsShownInUI = Object.keys(hiddenColumns)
      .filter((key) => hiddenColumns[key] === false)
      .map((key) => key);

    // We must include project_id in every query since it is set as a keyField in the Apollo cache.
    // See https://github.com/cityofaustin/atd-moped/blob/1ecf8745ef13277f784f3d8ba75efa13908acc73/moped-editor/src/App.js#L55
    // See https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids
    // Also, some columns are dependencies of other columns to render, so we need to include them.
    // Ex. Rendering ProjectStatusBadge requires current_phase_key which is not a column shown in the UI
    const columnsNeededToRender = ["project_id", "current_phase_key"];

    return [...columnsShownInUI, ...columnsNeededToRender];
  }, [hiddenColumns]);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        field: "project_id",
        hidden: hiddenColumns["project_id"],
      },
      {
        title: "Name",
        field: "project_name",
        hidden: hiddenColumns["project_name"],
        render: (entry) => (
          <Link
            component={RouterLink}
            to={`/moped/projects/${entry.project_id}`}
            state={{ queryString }}
            sx={{ color: theme.palette.primary.main }}
          >
            {entry.project_name}
          </Link>
        ),
        cellStyle: {
          position: "sticky",
          left: 0,
          backgroundColor: "white",
          minWidth: "20rem",
          zIndex: 1,
        },
      },
      {
        title: "Status",
        field: "current_phase",
        hidden: hiddenColumns["current_phase"],
        render: (entry) => (
          <ProjectStatusBadge
            phaseName={entry.current_phase}
            phaseKey={entry.current_phase_key}
            condensed
          />
        ),
      },
      {
        title: "Team",
        field: "project_team_members",
        hidden: hiddenColumns["project_team_members"],
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) =>
          filterProjectTeamMembers(
            entry.project_team_members,
            "projectsListView"
          ),
      },
      {
        title: "Lead",
        field: "project_lead",
        hidden: hiddenColumns["project_lead"],
        editable: "never",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) =>
          entry.project_lead === null ? "-" : entry.project_lead,
      },
      {
        title: "Sponsor",
        field: "project_sponsor",
        hidden: hiddenColumns["project_sponsor"],
        editable: "never",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) =>
          entry.project_sponsor === "None" ? "-" : entry.project_sponsor,
      },
      {
        title: "Partners",
        field: "project_partner",
        hidden: hiddenColumns["project_partner"],
        emptyValue: "-",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) => {
          return entry.project_partner.split(",").map((partner) => (
            <span key={partner} style={{ display: "block" }}>
              {partner}
            </span>
          ));
        },
      },
      {
        title: "eCAPRIS ID",
        field: "ecapris_subproject_id",
        hidden: hiddenColumns["ecapris_subproject_id"],
        render: (entry) => (
          <ExternalLink
            text={entry.ecapris_subproject_id}
            url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${entry.ecapris_subproject_id}`}
          />
        ),
      },
      {
        title: "Modified",
        field: "updated_at",
        hidden: hiddenColumns["updated_at"],
        render: (entry) => formatTimeStampTZType(entry.updated_at),
      },
      {
        title: "Signal IDs",
        field: "project_feature",
        hidden: hiddenColumns["project_feature"],
        sorting: COLUMN_CONFIG["project_feature"].sortable,
        render: (entry) => {
          if (!entry?.project_feature) {
            return "-";
          } else {
            const signals = entry.project_feature.filter(
              (signal) => signal.signal_id && signal.knack_id
            );
            return <RenderSignalLink signals={signals} />;
          }
        },
      },
      {
        title: "Task order(s)",
        field: "task_orders",
        hidden: hiddenColumns["task_orders"],
        cellStyle: { whiteSpace: "noWrap" },
        emptyValue: "-",
        render: (entry) => {
          // Empty value won't work in some cases where task_order is an empty array.
          if (entry?.task_orders.length < 1) {
            return "-";
          }
          // Render values as a comma seperated string
          return entry.task_orders.map((taskOrder) => (
            <span key={taskOrder.task_order} style={{ display: "block" }}>
              {taskOrder.task_order}
            </span>
          ));
        },
      },
      {
        title: "Type",
        field: "type_name",
        hidden: hiddenColumns["type_name"],
        emptyValue: "-",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) => {
          return entry.type_name.split(",").map((type_name) => (
            <span key={type_name} style={{ display: "block" }}>
              {type_name}
            </span>
          ));
        },
      },
      {
        title: "Funding",
        field: "funding_source_name",
        hidden: hiddenColumns["funding_source_name"],
        emptyValue: "-",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) => {
          return entry.funding_source_name
            .split(",")
            .map((funding_source_name, i) => (
              <span key={i} style={{ display: "block" }}>
                {funding_source_name}
              </span>
            ));
        },
      },
      {
        title: "Status update",
        field: "project_note",
        hidden: hiddenColumns["project_note"],
        emptyValue: "-",
        cellStyle: { maxWidth: "30rem" },
        render: (entry) => parse(String(entry.project_note)),
      },
      {
        title: "Construction start",
        field: "construction_start_date",
        hidden: hiddenColumns["construction_start_date"],
        emptyValue: "-",
        render: (entry) => formatDateType(entry.construction_start_date),
      },
      {
        title: "Completion date",
        field: "completion_end_date",
        hidden: hiddenColumns["completion_end_date"],
        emptyValue: "-",
        render: (entry) => formatDateType(entry.completion_end_date),
      },
      {
        title: "Designer",
        field: "project_designer",
        hidden: hiddenColumns["project_designer"],
        emptyValue: "-",
      },
      {
        title: "Inspector",
        field: "project_inspector",
        hidden: hiddenColumns["project_inspector"],
        emptyValue: "-",
      },
      {
        title: "Workgroup/Contractors",
        field: "workgroup_contractors",
        hidden: hiddenColumns["workgroup_contractors"],
        emptyValue: "-",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) => {
          return entry.workgroup_contractors.split(",").map((contractor, i) => (
            <span key={i} style={{ display: "block" }}>
              {contractor}
            </span>
          ));
        },
      },
      {
        title: "Contract numbers",
        field: "contract_numbers",
        hidden: hiddenColumns["contract_numbers"],
        emptyValue: "-",
        cellStyle: { whiteSpace: "noWrap" },
        render: (entry) => {
          return entry.contract_numbers.split(",").map((contractNumber, i) => (
            <span key={i} style={{ display: "block" }}>
              {contractNumber}
            </span>
          ));
        },
      },
      {
        title: "Tags",
        field: "project_tags",
        hidden: hiddenColumns["project_tags"],
        cellStyle: { whiteSpace: "noWrap" },
        emptyValue: "-",
        render: (entry) => {
          return entry.project_tags.split(",").map((tag) => (
            <span key={tag} style={{ display: "block" }}>
              {tag}
            </span>
          ));
        },
      },
      {
        title: "Created by",
        field: "added_by",
        hidden: hiddenColumns["added_by"],
        emptyValue: "-",
      },
      {
        title: "Public process status",
        field: "public_process_status",
        hidden: hiddenColumns["public_process_status"],
        emptyValue: "-",
      },
      {
        title: "Interim MPD (Access) ID",
        field: "interim_project_id",
        hidden: hiddenColumns["interim_project_id"],
        emptyValue: "-",
      },
      {
        title: "Components",
        field: "components",
        hidden: hiddenColumns["components"],
        emptyValue: "-",
        render: (entry) => filterComponentFullNames(entry),
      },
      {
        title: "Parent project",
        field: "parent_project_id",
        hidden: hiddenColumns["parent_project_id"],
        emptyValue: "-",
        render: (entry) => (
          <Link
            component={RouterLink}
            to={`/moped/projects/${entry.parent_project_id}`}
            state={{ queryString }}
            sx={{ color: theme.palette.primary.main }}
          >
            {entry.parent_project_name}
          </Link>
        ),
      },
      {
        title: "Has subprojects",
        field: "children_project_ids",
        hidden: hiddenColumns["children_project_ids"],
        render: (entry) => {
          const hasChildren = entry.children_project_ids.length > 0;
          return <span> {hasChildren ? "Yes" : "-"} </span>;
        },
        emptyValue: "-",
      },
    ],
    [hiddenColumns, queryString]
  );

  return { columns, columnsToReturnInQuery };
};

/**
 * Defines various Material Table options
 * @param {integer} queryLimit - the current rows per page option
 * @param {object[]} data - the project list view data
 * @returns {object} the material table setings options
 */
export const useTableOptions = ({ queryLimit, data }) =>
  useMemo(
    () => ({
      search: false,
      rowStyle: {
        fontFamily: typography.fontFamily,
        fontSize: "14px",
      },
      pageSize: Math.min(queryLimit, data?.project_list_view?.length),
      headerStyle: {
        // material table header row has a zIndex of 10, which
        // is conflicting with the search/filter dropdown
        zIndex: 1,
        whiteSpace: "nowrap",
      },
      columnsButton: true,
      idSynonym: "project_id",
    }),
    [queryLimit, data]
  );
