import { newItemButton, editItemButton } from "./StaffListViewCustomComponents";
import { StaffListViewFiltersConf } from "./StaffListViewFiltersConf";
import { StaffListViewExportConf } from "./StaffListViewExportConf";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {Object}
 * @default
 */
export const StaffListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "moped_users",
  customSingleItemButton: editItemButton,
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: true,
  customNewItemButton: newItemButton,
  noResultsMessage: "No staff found.",
  showPagination: false, // False disables pagination entirely
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: StaffListViewFiltersConf,
  export: StaffListViewExportConf,
  search: {
    placeholder: "Search user by email, or select field.",
    defaultField: "email",
  },
  columns: {
    user_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label: "",
      icon: {
        name: "edit_user",
        color: "primary",
      },
      width: "*",
      type: "Int",
    },
    first_name: {
      searchable: true,
      sortable: true,
      label: "First name",
      search: {
        label: "Search by First Name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "15%",
      type: "String",
    },
    last_name: {
      searchable: true,
      sortable: true,
      label: "Last name",
      search: {
        label: "Search by Last Name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "15%",
      type: "String",
    },
    email: {
      searchable: true,
      sortable: false,
      className: null,
      label: "E-Mail",
      search: {
        label: "Search by E-mail",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "20%",
      type: "String",
    },
    title: {
      searchable: true,
      sortable: true,
      label: "Title",
      search: {
        label: "Search by Title",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "20%",
      type: "String",
    },
    workgroup: {
      width: "20%",
      searchable: true,
      sortable: true,
      label: "Workgroup",
      search: {
        label: "Search by Workgroup",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    roles: {
      searchable: false,
      sortable: false,
      label: "Role",
      filter: (value) => (value ?? "N/A").replaceAll("moped-", ""),
      width: "10%",
      type: "String",
    },
  },
  // A single, un-nested order by directive ✅
  order_by: {
    first_name: "asc",
  },
  where: {
    is_deleted: "_eq: false",
  },
  limit: 25,
  offset: 0,
};
