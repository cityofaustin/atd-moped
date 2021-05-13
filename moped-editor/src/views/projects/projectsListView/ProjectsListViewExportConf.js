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
  current_status: {
    label: "current_status",
  },
  start_date: {
    label: "start_date",
    filter: value => new Date(value).toLocaleDateString('en-US', {timeZone: 'UTC'}),
  },
};
