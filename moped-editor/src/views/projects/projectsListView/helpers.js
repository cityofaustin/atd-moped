import { useMemo } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CopyTextButton from "src/components/CopyTextButton";
import parse from "html-react-parser";
import { formatDateType, FormattedDateString } from "src/utils/dateAndTime";
import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";
import RenderSignalLink from "src/components/RenderSignalLink";
import { PROJECT_LIST_VIEW_QUERY_CONFIG } from "src/views/projects/projectsListView/ProjectsListViewQueryConf";
import { substantialCompletionDateTooltipText } from "src/constants/projects";
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
  // if the view is projectsListView, render each team member as a block,
  // adding commas to all blocks except the final one
  if (view === "projectsListView") {
    const array = Object.keys(uniqueNames);
    return (
      <div style={{ display: "block" }}>
        {array.map((key, i) => (
          <span key={key} style={{ display: "block" }}>
            {`${key} - ${uniqueNames[key]}${i < array.length - 1 ? "," : ""}`}
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
  if (array && array.length > 0) {
    return "Yes";
  }
  return "No";
};

const renderSplitListDisplayBlock = (row, fieldName) => {
  if (row[fieldName]) {
    const array = row[fieldName].split(",");
    return (
      <div>
        {array.map((value, i) => {
          return (
            <span key={i} style={{ display: "block" }}>
              {`${value}${i < array.length - 1 ? "," : ""}`}
            </span>
          );
        })}
      </div>
    );
  }
};

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

  const [columnsToReturnInListView, visibleColumnsToReturnInExport] =
    useMemo(() => {
      const columnsShownInUI = Object.keys(hiddenColumns)
        .filter((key) => hiddenColumns[key])
        .map((key) => key);

      // We must include project_id in every query since it is set as a keyField in the Apollo cache.
      // See https://github.com/cityofaustin/atd-moped/blob/1ecf8745ef13277f784f3d8ba75efa13908acc73/moped-editor/src/App.js#L55
      // See https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids
      // Also, some columns are dependencies of other columns to render, so we need to include them.
      // Ex. Rendering ProjectStatusBadge requires current_phase_key which is not a column shown in the UI
      // Parent project Id needs the parent project name
      const columnsNeededForListView = [
        "project_id",
        "current_phase_key",
        "parent_project_name",
      ];
      // If parent project id is selected we also need to include the parent project name in the export
      const columnsNeededForExport = columnsShownInUI.includes(
        "parent_project_id"
      )
        ? ["project_id", "parent_project_name"]
        : ["project_id"];

      return [
        [...columnsShownInUI, ...columnsNeededForListView],
        [...columnsShownInUI, ...columnsNeededForExport],
      ];
    }, [hiddenColumns]);

  const columns = useMemo(
    () => [
      {
        headerName: "ID",
        field: "project_id",
        width: COLUMN_WIDTHS.xsmall,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        width: COLUMN_WIDTHS.xlarge,
        renderCell: ({ row }) => (
          <Link
            component={RouterLink}
            to={`/moped/projects/${row.project_id}`}
            state={{ queryString }}
            sx={{ color: theme.palette.primary.main }}
          >
            {row.project_name_full}
          </Link>
        ),
      },
      {
        headerName: "Name",
        field: "project_name",
        width: COLUMN_WIDTHS.xlarge,
      },
      {
        headerName: "Secondary name",
        field: "project_name_secondary",
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Status",
        field: "current_phase",
        width: COLUMN_WIDTHS.medium,
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
        headerName: "Description",
        field: "project_description",
        width: COLUMN_WIDTHS.xlarge,
      },
      {
        headerName: "Team",
        field: "project_team_members",
        width: COLUMN_WIDTHS.large,
        renderCell: ({ row }) =>
          filterProjectTeamMembers(
            row.project_team_members,
            "projectsListView"
          ),
      },
      {
        headerName: "Lead",
        field: "project_lead",
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Sponsor",
        field: "project_sponsor",
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Partners",
        field: "project_partners",
        width: COLUMN_WIDTHS.large,
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_partners"),
      },
      {
        headerName: "eCAPRIS ID",
        field: "ecapris_subproject_id",
        width: COLUMN_WIDTHS.small,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Typography variant="body2">{row.ecapris_subproject_id}</Typography>
            {row.ecapris_subproject_id ? (
              <CopyTextButton
                textToCopy={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${row.ecapris_subproject_id}`}
                copyButtonText="Copy eCAPRIS link"
                iconOnly
                iconProps={{ fontSize: "small" }}
                buttonProps={{
                  sx: { top: "-5px" },
                }}
              />
            ) : null}
          </Stack>
        ),
      },
      {
        headerName: "Modified",
        description: "Date record was last modified",
        field: "updated_at",
        width: COLUMN_WIDTHS.medium,
        renderCell: ({ row }) => (
          <FormattedDateString
            date={row.updated_at}
            primary="relative"
            secondary="absolute"
          />
        ),
      },
      {
        headerName: "Signal IDs",
        field: "project_feature",
        sortable: COLUMN_CONFIG["project_feature"].sortable,
        renderCell: ({ row }) => {
          if (row?.project_feature) {
            const signals = row.project_feature.filter(
              (signal) => signal.signal_id && signal.knack_id
            );
            return <RenderSignalLink signals={signals} />;
          }
        },
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Task order(s)",
        field: "task_orders",
        renderCell: ({ row }) => {
          if (row.task_orders && row?.task_orders.length > 0) {
            return (
              <div>
                {row.task_orders.map((taskOrder, i) => (
                  <span key={i} style={{ display: "block" }}>
                    {taskOrder.task_order}
                  </span>
                ))}
              </div>
            );
          }
        },
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Component work types",
        field: "component_work_type_names",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "component_work_type_names"),
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Funding",
        field: "funding_source_and_program_names",
        cellStyle: { whiteSpace: "noWrap" },
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "funding_source_and_program_names"),
        width: COLUMN_WIDTHS.medium,
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
        width: COLUMN_WIDTHS.xlarge,
      },
      {
        headerName: "Substantial completion date",
        field: "substantial_completion_date",
        description: substantialCompletionDateTooltipText,
        valueFormatter: (value) => value && formatDateType(value),
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Construction start",
        field: "construction_start_date",
        valueFormatter: (value) => value && formatDateType(value),
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Designer",
        field: "project_designer",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_designer"),
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Inspector",
        field: "project_inspector",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_inspector"),
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Workgroup/Contractors",
        field: "workgroup_contractors",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "workgroup_contractors"),
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Contract numbers",
        field: "contract_numbers",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "contract_numbers"),
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Project tags",
        field: "project_tags",
        renderCell: ({ row }) =>
          renderSplitListDisplayBlock(row, "project_tags"),
        width: COLUMN_WIDTHS.large,
      },
      {
        headerName: "Created by",
        field: "added_by",
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Public process status",
        field: "public_process_status",
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Interim MPD (Access) ID",
        field: "interim_project_id",
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Components",
        field: "components",
        renderCell: ({ row }) => renderSplitListDisplayBlock(row, "components"),
        width: COLUMN_WIDTHS.medium,
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
        sortable: COLUMN_CONFIG["parent_project_id"].sortable,
        width: COLUMN_WIDTHS.medium,
      },
      {
        headerName: "Has subprojects",
        field: "children_project_ids",
        valueFormatter: (value) => {
          const hasChildren = value && value.length > 0;
          return hasChildren && "Yes";
        },
        width: COLUMN_WIDTHS.small,
      },
      {
        headerName: "Council districts",
        field: "project_and_child_project_council_districts",
        sortable:
          COLUMN_CONFIG["project_and_child_project_council_districts"].sortable,
        valueFormatter: (value) => value && value.join(", "),
      },
    ],
    [queryString]
  );

  return { columns, columnsToReturnInListView, visibleColumnsToReturnInExport };
};
