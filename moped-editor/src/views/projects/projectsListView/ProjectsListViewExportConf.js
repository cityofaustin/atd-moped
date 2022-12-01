import { filterProjectTeamMembers, filterProjectFeatures } from "./helpers.js";

/**
 * The ProjectsListView export settings
 * @constant
 * @type {object}
 * @default
 */
export const ProjectsListViewExportConf = {
  project_id: {
    label: "project_id",
  },
  project_name: {
    label: "project_name",
  },
  project_description: {
    label: "project_description",
  },
  current_phase_key: {
    label: "current_phase_key",
  },
  current_phase: {
    label: "current_phase",
  },
  project_team_members: {
    label: "project_team_members",
    // filter: filterProjectTeamMembers,
  },
  ecapris_subproject_id: {
    label: "ecapris_id",
  },
  project_lead: {
    label: "project_lead",
  },
  project_sponsor: {
    label: "project_sponsor",
  },
  project_partner: {
    label: "project_partner",
  },
  updated_at: {
    label: "updated_at",
  },
  task_order_name: {
    label: "task_order_name",
  },
  project_feature: {
    label: "signal_ids",
    filter: filterProjectFeatures,
  },
  type_name: {
    label: "type_name",
  },
  funding_source_name: {
    label: "funding_source_name",
  },
  project_note: {
    label: "project_note",
  },
  construction_start_date: {
    label: "construction_start_date",
  },
  completion_end_date: {
    label: "completion_end_date",
  },
  project_inspector: {
    label: "project_inspector",
  },
  project_designer: {
    label: "project_designer",
  },
  contractors: {
    label: "contractors",
  },
  contract_numbers: {
    label: "contract_numbers",
  },
  project_tags: {
    label: "project_tags",
  },
  added_by: {
    label: "added_by",
  },
};
