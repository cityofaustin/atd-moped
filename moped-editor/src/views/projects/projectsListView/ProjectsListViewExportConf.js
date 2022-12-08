import { filterProjectTeamMembers } from "./helpers.js";

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
    filter: filterProjectTeamMembers,
  },
  ecapris_subproject_id: {
    label: "ecapris_id",
  },
  project_sponsor: {
    label: "project_sponsor",
  },
  project_partner: {
    label: "project_partner",
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
};
