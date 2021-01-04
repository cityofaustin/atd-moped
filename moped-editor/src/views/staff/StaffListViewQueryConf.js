/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {Object}
 * @augments StaffListViewFiltersConf
 * @default
 */
export const StaffListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "no-cache", // Default ise "cache-first", or use "no-cache"
      // Use no-cache as per issue https://github.com/cityofaustin/atd-data-tech/issues/4788
      // More info: https://www.apollographql.com/docs/react/get-started/#graphql-config-options-fetchPolicy
    },
  },
  table: "moped_users",
  single_item: "/moped/staff/edit",
  new_item: "/moped/staff/new",
  new_item_label: "Add Staff",
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: true,
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: {},
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
      label: "First Name",
      search: {
        label: "Search by First Name",
        operator: "_eq",
        quoted: true,
        envelope: "{VALUE}",
      },
      type: "String",
    },
    last_name: {
      searchable: true,
      sortable: true,
      label: "Last Name",
      search: {
        label: "Search by Last Name",
        operator: "_eq",
        quoted: true,
        envelope: "{VALUE}",
      },
      type: "String",
    },
    email: {
      searchable: true,
      sortable: false,
      label: "E-Mail",
      search: {
        label: "Search by E-mail",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    date_added: {
      searchable: false,
      sortable: true,
      label: "Date Added",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    staff_uuid: {
      searchable: false,
      sortable: false,
      label: "Staff UUID",
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
      type: "String",
    },
    workgroup: {
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
    cognito_user_id: {
      searchable: true,
      sortable: false,
      label: "Cognito User ID",
      search: {
        label: "Search by Cognito User ID",
        operator: "_eq",
        quoted: true,
        envelope: "{VALUE}",
      },
      type: "String",
    },
    is_coa_staff: {
      searchable: false,
      sortable: false,
      label: "COA Staff",
      type: "Boolean",
    },
    status_id: {
      searchable: false,
      sortable: false,
      label: "Status ID",
      type: "Boolean",
    },
  },
  order_by: {},
  where: {},
  limit: 25,
  offset: 0,
};
