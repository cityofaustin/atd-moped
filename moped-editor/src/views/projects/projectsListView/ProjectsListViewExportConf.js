import {
  filterNullValues,
  filterProjectTeamMembers,
  filterProjectSignals,
  filterTaskOrderName,
  filterStatusUpdate,
} from "./helpers.js";

/**
 * The ProjectsListView export settings
 * @constant
 * @type {object}
 * @default
 */
export const ProjectsListViewExportConf = {
  project_id: {
    label: "ID",
  },
  project_name: {
    label: "Name",
    filter: filterNullValues,
  },
  project_description: {
    label: "Project Description",
    filter: filterNullValues,
  },
  current_phase_key: {
    label: "Current Phase Key",
    filter: filterNullValues,
  },
  current_phase: {
    label: "Status",
    filter: filterNullValues,
  },
  project_team_members: {
    label: "Team",
    filter: filterProjectTeamMembers,
  },
  ecapris_subproject_id: {
    label: "eCapris ID",
    filter: filterNullValues,
  },
  project_lead: {
    label: "Lead",
    filter: filterNullValues,
  },
  project_sponsor: {
    label: "Sponsor",
    filter: filterNullValues,
  },
  project_partner: {
    label: "Partners",
    filter: filterNullValues,
  },
  updated_at: {
    label: "Modified",
  },
  task_order: {
    label: "Task Order",
    filter: filterTaskOrderName,
  },
  project_feature: {
    label: "Signal IDs",
    filter: filterProjectSignals,
  },
  type_name: {
    label: "Type",
    filter: filterNullValues,
  },
  funding_source_name: {
    label: "Funding",
    filter: filterNullValues,
  },
  project_note: {
    label: "Status Update",
    filter: filterStatusUpdate,
  },
  construction_start_date: {
    label: "Construction start",
    filter: filterNullValues,
  },
  completion_end_date: {
    label: "Completion date",
    filter: filterNullValues,
  },
  project_inspector: {
    label: "Inspector",
    filter: filterNullValues,
  },
  project_designer: {
    label: "Designer",
    filter: filterNullValues,
  },
  contractors: {
    label: "Contractors",
    filter: filterNullValues,
  },
  contract_numbers: {
    label: "Contract numbers",
    filter: filterNullValues,
  },
  project_tags: {
    label: "Tags",
    filter: filterNullValues,
  },
  added_by: {
    label: "Created by",
  },
  public_process_status: {
    label: "Public process status",
    filter: filterNullValues,
  },
};
