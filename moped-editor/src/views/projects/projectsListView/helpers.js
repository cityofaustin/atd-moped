import { useMemo } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
import Link from "@mui/material/Link";
import parse from "html-react-parser";
import { formatDateType, formatTimeStampTZType } from "src/utils/dateAndTime";
import ExternalLink from "../../../components/ExternalLink";
import ProjectStatusBadge from "../projectView/ProjectStatusBadge";
import RenderSignalLink from "../../../components/RenderSignalLink";
import { PROJECT_LIST_VIEW_QUERY_CONFIG } from "./ProjectsListViewQueryConf";
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
    return (
      <div style={{ display: "block" }}>
        {Object.keys(uniqueNames).map((key) => (
          <span key={key} style={{ display: "block" }}>
            {`${key} - ${uniqueNames[key]}`}
          </span>
        ))}
      </div>
    );
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

const renderSplitListDisplayBlock = (row, fieldName) =>
  row[fieldName] && (
    <div style={{ display: "block" }}>
      {row[fieldName].split(",").map((value, i) => (
        <span key={i} style={{ display: "block" }}>
          {value}
        </span>
      ))}
    </div>
  );

const COLUMN_CONFIG = PROJECT_LIST_VIEW_QUERY_CONFIG.columns;

const COLUMN_WIDTHS = {
  xsmall: 75,
  small: 125,
  medium: 200,
  large: 250,
  xlarge: 350,
};

/**
 * The Material Table column settings
 */
export const useColumns = ({ hiddenColumns }) => {
  const location = useLocation();
  const queryString = location.search;

  const columnsToReturnInQuery = useMemo(() => {
    const columnsShownInUI = Object.keys(hiddenColumns)
      .filter((key) => hiddenColumns[key])
      .map((key) => key);

    // We must include project_id in every query since it is set as a keyField in the Apollo cache.
    // See https://github.com/cityofaustin/atd-moped/blob/1ecf8745ef13277f784f3d8ba75efa13908acc73/moped-editor/src/App.js#L55
    // See https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids
    // Also, some columns are dependencies of other columns to render, so we need to include them.
    // Ex. Rendering ProjectStatusBadge requires current_phase_key which is not a column shown in the UI
    // Parent project Id needs the parent project name
    const columnsNeededToRender = [
      "project_id",
      "current_phase_key",
      "parent_project_name",
    ];

    return [...columnsShownInUI, ...columnsNeededToRender];
  }, [hiddenColumns]);

  const columns = useMemo(
    () => [
      {
        headerName: "ID",
        field: "project_id",
        width: COLUMN_WIDTHS.xsmall,
      },
      {
        headerName: "Name",
        field: "project_name",
        flex: 2,
        minWidth: COLUMN_WIDTHS.xlarge,
        renderCell: ({ row }) => (
          <Link
            component={RouterLink}
            to={`/moped/projects/${row.project_id}`}
            state={{ queryString }}
            sx={{ color: theme.palette.primary.main }}
          >
            {row.project_name}
          </Link>
        ),
      },
      {
        headerName: "Status",
        field: "current_phase",
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
        renderCell: ({ row }) => {
          return (
            <ProjectStatusBadge
              phaseName={row.current_phase}
              phaseKey={row.current_phase_key}
              condensed
            />
          );
        },
      },
      {
        headerName: "Team",
        field: "project_team_members",
        flex: 1,
        minWidth: COLUMN_WIDTHS.large,
        renderCell: ({ row }) =>
          filterProjectTeamMembers(
            row.project_team_members,
            "projectsListView"
          ),
      },
      {
        headerName: "Lead",
        field: "project_lead",
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Sponsor",
        field: "project_sponsor",
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Partners",
        field: "project_partners",
        minWidth: COLUMN_WIDTHS.large,
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_partners"),
      },
      {
        headerName: "eCapris ID",
        field: "ecapris_subproject_id",
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
        renderCell: ({ row }) => (
          <ExternalLink
            text={row.ecapris_subproject_id}
            url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${row.ecapris_subproject_id}`}
          />
        ),
      },
      {
        headerName: "Updated",
        description: "Date record was last modified", // originally called modified but in johns branch it said updated
        field: "updated_at",
        valueGetter: ({ row }) => formatTimeStampTZType(row.updated_at),
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Signal IDs",
        field: "project_feature",
        hidden: hiddenColumns["project_feature"],
        sorting: COLUMN_CONFIG["project_feature"].sortable,
        renderCell: ({ row }) => {
          if (row?.project_feature) {
            const signals = row.project_feature.filter(
              (signal) => signal.signal_id && signal.knack_id
            );
            return <RenderSignalLink signals={signals} />;
          }
        },
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Task order(s)",
        field: "task_orders",
        renderCell: ({ row }) => {
          // Empty value won't work in some cases where task_order is an empty array.
          if (row.task_orders && row?.task_orders.length > 0) {
            // Render values as a comma seperated string
            return (
              <div style={{ display: "block" }}>
                {row.task_orders.map((taskOrder) => (
                  <span key={taskOrder.task_order} style={{ display: "block" }}>
                    {taskOrder.task_order}
                  </span>
                ))}
              </div>
            );
          }
        },
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Type",
        field: "type_name",
        renderCell: ({ row }) => renderSplitListDisplayBlock(row, "type_name"),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Funding",
        field: "funding_source_name",
        cellStyle: { whiteSpace: "noWrap" },
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "funding_source_name"),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Status update",
        field: "project_status_update",
        renderCell: ({ row }) => {
          return (
            row.project_status_update &&
            parse(String(row.project_status_update))
          );
        },
        flex: 1,
        minWidth: COLUMN_WIDTHS.xlarge,
      },
      {
        headerName: "Construction start",
        field: "construction_start_date",
        valueFormatter: ({ value }) => formatDateType(value),
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Completion date",
        field: "completion_end_date",
        valueFormatter: ({ value }) => formatDateType(value),
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Designer",
        field: "project_designer",
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Inspector",
        field: "project_inspector",
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Workgroup/Contractors",
        field: "workgroup_contractors",
        cellStyle: { whiteSpace: "noWrap" },
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "workgroup_contractors"),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Contract numbers",
        field: "contract_numbers",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "contract_numbers"),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Tags",
        field: "project_tags",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_tags"),
        flex: 1,
        minWidth: COLUMN_WIDTHS.large,
      },
      {
        headerName: "Created by",
        field: "added_by",
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Public process status",
        field: "public_process_status",
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Interim MPD (Access) ID",
        field: "interim_project_id",
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Components",
        field: "components",
        render: (entry) => filterComponentFullNames(entry),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Parent project",
        field: "parent_project_id",
        renderCell: ({ row }) => (
          <Link
            component={RouterLink}
            to={`/moped/projects/${row.parent_project_id}`}
            state={{ queryString }}
            sx={{ color: theme.palette.primary.main }}
          >
            {row.parent_project_name}
          </Link>
        ),
        flex: 1,
        minWidth: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Has subprojects",
        field: "children_project_ids",
        valueFormatter: ({ value }) => {
          const hasChildren = value && value.length > 0;
          return hasChildren && "Yes";
        },
        flex: 1,
        minWidth: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Council districts",
        field: "project_and_child_project_council_districts",
        valueFormatter: ({ value }) => value && value.join(", "),
      },
    ],
    [hiddenColumns, queryString]
  );

  return { columns, columnsToReturnInQuery };
};
