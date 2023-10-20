import {
  filterProjectTeamMembers,
  filterProjectSignals,
  filterTaskOrderName,
  resolveHasSubprojects,
} from "./helpers.js";

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
  project_name: {
    label: "Name",
  },
  project_description: {
    label: "Project Description",
  },
  current_phase_key: {
    label: "Current Phase Key",
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
  project_partner: {
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
  funding_source_name: {
    label: "Funding",
  },
  project_note: {
    label: "Status Update",
  },
  construction_start_date: {
    label: "Construction start",
  },
  completion_end_date: {
    label: "Completion date",
  },
  project_inspector: {
    label: "Inspector",
  },
  project_designer: {
    label: "Designer",
  },
  contractors: {
    label: "Contractors",
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
  children_project_ids: {
    label: "Has subprojects",
    filter: resolveHasSubprojects,
  },
};
