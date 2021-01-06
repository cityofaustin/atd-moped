/**
 * The ProjectsListView export settings
 * @constant
 * @type {Object}
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
    date_added: {
        label: "date_added",
        filter: value => new Date(value).toLocaleDateString(),
    },
    start_date: {
        label: "start_date",
        filter: value => new Date(value).toLocaleDateString(),
    },
    capitally_funded: {
        label: "capitally_funded",
        filter: value => value === true ? "True" : "False",
    },
}
