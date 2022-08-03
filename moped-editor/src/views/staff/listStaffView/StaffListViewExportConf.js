/**
 * The StaffListView export settings
 * @constant
 * @type {object}
 * @default
 */
export const StaffListViewExportConf = {
  user_id: {
    label: "user_id",
  },
  first_name: {
    label: "first_name",
  },
  last_name: {
    label: "last_name",
  },
  email: {
    label: "email",
  },
  date_added: {
    label: "date_added",
  },
  staff_uuid: {
    label: "staff_uuid",
  },
  title: {
    label: "title",
  },
  workgroup: {
    label: "workgroup",
  },
  cognito_user_id: {
    label: "cognito_user_id",
  },
  is_coa_staff: {
    label: "is_coa_staff",
    filter: (value) => (value === true ? "True" : "False"),
  },
  is_deleted: {
    label: "is_deleted",
  },
};
