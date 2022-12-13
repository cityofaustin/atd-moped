import {
  filterNullValues,
  filterProjectTeamMembers,
  filterProjectFeatures,
  filterTaskOrderName,
} from "./helpers.js";

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
    filter: filterNullValues,
  },
  project_description: {
    label: "project_description",
    filter: filterNullValues,
  },
  current_phase_key: {
    label: "current_phase_key",
    filter: filterNullValues,
  },
  current_phase: {
    label: "current_phase",
    filter: filterNullValues,
  },
  project_team_members: {
    label: "project_team_members",
    filter: filterProjectTeamMembers,
  },
  ecapris_subproject_id: {
    label: "ecapris_id",
    filter: filterNullValues,
  },
  project_lead: {
    label: "project_lead",
    filter: filterNullValues,
  },
  project_sponsor: {
    label: "project_sponsor",
    filter: filterNullValues,
  },
  project_partner: {
    label: "project_partner",
    filter: filterNullValues,
  },
  updated_at: {
    label: "updated_at",
  },
  task_order: {
    label: "task_order",
    filter: filterTaskOrderName,
  },
  project_feature: {
    label: "signal_ids",
    filter: filterProjectFeatures,
  },
  type_name: {
    label: "type_name",
    filter: filterNullValues,
  },
  funding_source_name: {
    label: "funding_source_name",
    filter: filterNullValues,
  },
  project_note: {
    label: "project_note",
    filter: filterNullValues,
  },
  construction_start_date: {
    label: "construction_start_date",
    filter: filterNullValues,
  },
  completion_end_date: {
    label: "completion_end_date",
    filter: filterNullValues,
  },
  project_inspector: {
    label: "project_inspector",
    filter: filterNullValues,
  },
  project_designer: {
    label: "project_designer",
    filter: filterNullValues,
  },
  contractors: {
    label: "contractors",
    filter: filterNullValues,
  },
  contract_numbers: {
    label: "contract_numbers",
    filter: filterNullValues,
  },
  project_tags: {
    label: "project_tags",
    filter: filterNullValues,
  },
  added_by: {
    label: "added_by",
  },
};
