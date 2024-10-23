import {
  filterProjectTeamMembers,
  filterProjectSignals,
  filterTaskOrderName,
  resolveHasSubprojects,
} from "./helpers.js";
import { formatTimeStampTZType } from "src/utils/dateAndTime.js";

/**
 * The ProjectsListView export settings
 * @constant
 * @type {object}
 * @default
 */
export const PROJECT_LIST_VIEW_EXPORT_CONFIG = {
  project_id: {
    label: "ID",
  },
  project_name_full: {
    label: "Full name",
  },
  project_name: {
    label: "Name",
  },
  project_name_secondary: {
    label: "Secondary name",
  },
  project_description: {
    label: "Project Description",
  },
  current_phase: {
    label: "Status",
  },
  project_team_members: {
    label: "Team",
    filter: filterProjectTeamMembers,
  },
  ecapris_subproject_id: {
    label: "eCapris ID",
  },
  project_lead: {
    label: "Lead",
  },
  project_sponsor: {
    label: "Sponsor",
  },
  project_partners: {
    label: "Partners",
  },
  updated_at: {
    label: "Modified",
  },
  task_orders: {
    label: "Task Order",
    filter: filterTaskOrderName,
  },
  project_feature: {
    label: "Signal IDs",
    filter: filterProjectSignals,
  },
  type_name: {
    label: "Type",
  },
  funding_source_and_program_names: {
    label: "Funding",
  },
  project_status_update: {
    label: "Status Update",
  },
  substantial_completion_date: {
    label: "Substantial completion date",
    filter: formatTimeStampTZType,
  },
  construction_start_date: {
    label: "Construction start",
    filter: formatTimeStampTZType,
  },
  project_inspector: {
    label: "Inspector",
  },
  project_designer: {
    label: "Designer",
  },
  workgroup_contractors: {
    label: "Workgroup/Contractors",
  },
  contract_numbers: {
    label: "Contract numbers",
  },
  project_tags: {
    label: "Tags",
  },
  added_by: {
    label: "Created by",
  },
  public_process_status: {
    label: "Public process status",
  },
  parent_project_name: {
    label: "Parent project name",
  },
  parent_project_id: {
    label: "Parent project ID",
  },
  children_project_ids: {
    label: "Has subprojects",
    filter: resolveHasSubprojects,
  },
  components: {
    label: "Components",
  },
  interim_project_id: {
    label: "Interim MPD (Access) ID",
  },
  project_and_child_project_council_districts: {
    label: "Council districts",
  },
};
