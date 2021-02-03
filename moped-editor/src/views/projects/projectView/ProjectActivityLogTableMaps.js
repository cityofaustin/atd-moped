export const ProjectActivityLogTableMaps = {
  moped_project: {
    label: "Project's",
    fields: {
      default: { label: "Unknown Field", icon: "", data_type: "unknown" },
      project_uuid: { label: "Unique ID", icon: "", data_type: "uuid" },
      project_name: { label: "Name", icon: "", data_type: "text" },
      project_description: {
        label: "Description",
        icon: "",
        data_type: "text",
      },
      project_description_public: {
        label: "Public description",
        icon: "",
        data_type: "text",
      },
      ecapris_id: { label: "eCapris ID", icon: "", data_type: "text" },
      project_importance: {
        label: "Importance",
        icon: "",
        data_type: "integer",
      },
      project_order: {
        label: "Order",
        icon: "",
        data_type: "integer",
      },
      current_status: { label: "Current Status", icon: "", data_type: "text" },
      project_id: { label: "ID", icon: "", data_type: "integer" },
      timeline_id: { label: "Timeline", icon: "", data_type: "integer" },
      current_phase: { label: "Phase", icon: "", data_type: "text" },
      end_date: { label: "End Date", icon: "", data_type: "date" },
      project_length: {
        label: "Project Length",
        icon: "",
        data_type: "integer",
      },
      start_date: { label: "Start Date", icon: "", data_type: "date" },
      fiscal_year: { label: "Fiscal Year", icon: "", data_type: "text" },
      capitally_funded: {
        label: "Capitally Funded",
        icon: "",
        data_type: "boolean",
      },
      project_priority: { label: "Priority", icon: "", data_type: "text" },
      date_added: {
        label: "Date Added",
        icon: "",
        data_type: "timestamp with time zone",
      },
      added_by: { label: "Added by", icon: "", data_type: "integer" },
      project_extent_ids: { label: "Extent", icon: "", data_type: "jsonb" },
      project_extent_geojson: {
        label: "Extent GeoJson Data",
        icon: "",
        data_type: "jsonb",
      },
    },
  },
};

export const ProjectActivityLogOperationMaps = {
  DELETE: {
    label: "Deleted",
    icon: "cross",
  },
  INSERT: {
    label: "Created",
    icon: "create",
  },
  UPDATE: {
    label: "Updated",
    icon: "create",
  },
};
