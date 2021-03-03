import { gql } from "@apollo/client";

export const ProjectActivityLogTableMaps = {
  moped_project: {
    label: "Project",
    fields: {
      project_uuid: {
        icon: "",
        label: "Unique ID",
        data_type: "uuid",
      },
      project_name: {
        icon: "",
        label: "Name",
        data_type: "text",
      },
      project_description: {
        icon: "",
        label: "Description",
        data_type: "text",
      },
      project_description_public: {
        icon: "",
        label: "Public description",
        data_type: "text",
      },
      ecapris_id: {
        label: "eCapris ID",
        icon: "",
        data_type: "text",
      },
      project_importance: {
        icon: "",
        label: "Importance",
        data_type: "integer",
      },
      project_order: {
        icon: "",
        label: "Order",
        data_type: "integer",
      },
      current_status: {
        icon: "",
        label: "Current Status",
        data_type: "text",
      },
      project_id: {
        icon: "",
        label: "ID",
        data_type: "integer",
      },
      timeline_id: {
        icon: "",
        label: "Timeline",
        data_type: "integer",
      },
      current_phase: {
        icon: "",
        label: "Phase",
        data_type: "text",
      },
      end_date: {
        icon: "",
        label: "End Date",
        data_type: "date",
      },
      project_length: {
        label: "Length",
        icon: "",
        data_type: "integer",
      },
      start_date: {
        icon: "",
        label: "Start Date",
        data_type: "date",
      },
      fiscal_year: {
        icon: "",
        label: "Fiscal Year",
        data_type: "text",
      },
      capitally_funded: {
        icon: "",
        label: "Capitally Funded",
        data_type: "boolean",
      },
      project_priority: {
        icon: "",
        label: "Priority",
        data_type: "text",
      },
      date_added: {
        label: "Date Added",
        icon: "",
        data_type: "timestamp with time zone",
      },
      added_by: {
        icon: "",
        label: "Added by",
        data_type: "integer",
      },
      project_extent_ids: {
        icon: "",
        label: "Extent",
        data_type: "jsonb",
      },
      project_extent_geojson: {
        icon: "",
        label: "Extent GeoJson Data",
        data_type: "jsonb",
      },
    },
  },
  moped_proj_entities: {
    label: "Project Entity",
    fields: {
      project_sponsors: {
        icon: "",
        label: "Sponsor",
        type: "text",
      },
      entity_list_id: {
        icon: "",
        label: "List ID",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      project_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      project_personnel: {
        icon: "",
        label: "Personnel",
        type: "text",
      },
      workgroups: {
        icon: "",
        label: "Workgroups",
        type: "int4",
      },
      partners: {
        icon: "",
        label: "Partners",
        type: "text",
      },
      project_groups: {
        icon: "",
        label: "Groups",
        type: "bpchar",
      },
    },
  },
  moped_proj_financials: {
    label: "Project Financials",
    fields: {
      primary_funding_source: {
        icon: "",
        label: "Funding Source",
        type: "text",
      },
      financials_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      last_updated: {
        icon: "",
        label: "Last Update Date",
        type: "timestamptz",
      },
      subproject_status: {
        icon: "",
        label: "Subproject Status",
        type: "text",
      },
      budget_total: {
        icon: "",
        label: "Budget Total",
        type: "float8",
      },
      expenses_total: {
        icon: "",
        label: "Total Expenses",
        type: "float8",
      },
      expenses_ytd: {
        icon: "",
        label: "YTD Expenses",
        type: "float8",
      },
      expenses_previous: {
        icon: "",
        label: "Previous Expenses",
        type: "float8",
      },
      budget_previous: {
        icon: "",
        label: "Previous Budget",
        type: "float8",
      },
      budget_available: {
        icon: "",
        label: "Available Budget",
        type: "float8",
      },
      project_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      subproject_name: {
        icon: "",
        label: "Subproject Name",
        type: "text",
      },
      eCapris_id: {
        icon: "",
        label: "eCapris ID",
        type: "text",
      },
    },
  },
  moped_proj_fiscal_years: {
    label: "Fiscal Year",
    fields: {
      fiscal_year_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      fiscal_year_start: {
        icon: "",
        label: "Start",
        type: "date",
      },
      fiscal_year_end: {
        icon: "",
        label: "End",
        type: "date",
      },
      budget_total: {
        icon: "",
        label: "Total Budget",
        type: "int4",
      },
      expenses_total: {
        icon: "",
        label: "Total Expenses",
        type: "int4",
      },
      budget_available_at_end: {
        icon: "",
        label: "Budget Available At End",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
    },
  },
  moped_proj_fund_opp: {
    label: "Funding Opportunity",
    fields: {
      fund_opp_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      fund_opp_id: {
        icon: "",
        label: "Opportunity ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      proj_fund_opp_id: {
        icon: "",
        label: "Fund ID",
        type: "int4",
      },
    },
  },
  moped_proj_fund_source: {
    label: "Fund Source",
    fields: {
      funding_source_category: {
        icon: "",
        label: "Category",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      funding_source_other: {
        icon: "",
        label: "Other Funding Source",
        type: "bpchar",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      proj_fund_source_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      funding_source_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
    },
  },
  moped_proj_groups: {
    label: "Project Group",
    fields: {
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      added_by: {
        icon: "",
        label: "Added by",
        type: "int4",
      },
      group_id: {
        icon: "",
        label: "Group ID",
        type: "int4",
      },
      group_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      proj_group_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
    },
  },
  moped_proj_location: {
    label: "Project Location",
    fields: {
      location_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      feature_id: {
        icon: "",
        label: "Feature ID",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      location_notes: {
        icon: "",
        label: "Notes",
        type: "text",
      },
      shape: {
        icon: "",
        label: "Shape",
        type: "text",
      },
      location_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
    },
  },
  moped_proj_milestones: {
    label: "Project Milestone",
    fields: {
      milestone_end: {
        icon: "",
        label: "End Date",
        type: "date",
      },
      days_left: {
        icon: "",
        label: "Days Left",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      project_milestone_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      completed: {
        icon: "",
        label: "Completion",
        type: "bool",
      },
      is_current_milestone: {
        icon: "",
        label: "Is Current Milestone Flag",
        type: "bool",
      },
      milestone_order: {
        icon: "",
        label: "Order",
        type: "int4",
      },
      milestone_description: {
        icon: "",
        label: "Description",
        type: "text",
      },
      milestone_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      milestone_owner_id: {
        icon: "",
        label: "Owner ID",
        type: "int4",
      },
      project_timeline_id: {
        icon: "",
        label: "Timeline ID",
        type: "int4",
      },
      milestone_privacy: {
        icon: "",
        label: "Privacy Flag",
        type: "bool",
      },
      milestone_length: {
        icon: "",
        label: "Length",
        type: "int4",
      },
      milestone_start: {
        icon: "",
        label: "Start Date",
        type: "date",
      },
    },
  },
  moped_proj_notes: {
    label: "Project Note",
    fields: {
      added_by: {
        icon: "",
        label: "Added By",
        type: "bpchar",
      },
      comm_id: {
        icon: "",
        label: "Comm ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      project_note_id: {
        icon: "",
        label: "Note ID",
        type: "int4",
      },
      date_created: {
        icon: "",
        label: "Date Created",
        type: "timestamptz",
      },
      project_note: {
        icon: "",
        label: "Note",
        type: "text",
      },
    },
  },

  moped_proj_partners: {
    label: "Project Partner",
    fields: {
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      proj_partner_id: {
        icon: "",
        label: "Partner ID",
        type: "int4",
      },
      partner_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      entity_id: {
        icon: "",
        label: "Entity ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
    },
  },

  moped_proj_personnel: {
    label: "Project Personnel",
    fields: {
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      project_personnel_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      notes: {
        icon: "",
        label: "Notes",
        type: "text",
      },
      status_id: {
        icon: "",
        label: "Status",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      role_id: {
        icon: "",
        label: "Role ID",
        type: "int4",
        lookup: {
          table: "moped_project_roles",
          fieldLabel: "project_role_id",
          fieldValue: "project_role_name",
        },
      },
      user_id: {
        icon: "",
        label: "User ID",
        type: "int4",
      },
    },
  },

  moped_proj_phases: {
    label: "Project Phases",
    fields: {
      phase_rank: {
        icon: "",
        label: "Rank",
        type: "int4",
      },
      phase_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      phase_description: {
        icon: "",
        label: "Description",
        type: "text",
      },
      completion_percentage: {
        icon: "",
        label: "Completion Percentage",
        type: "int4",
      },
      phase_status: {
        icon: "",
        label: "Status",
        type: "text",
      },
      phase_privacy: {
        icon: "",
        label: "Privacy",
        type: "bool",
      },
      phase_start: {
        icon: "",
        label: "Start Date",
        type: "date",
      },
      phase_end: {
        icon: "",
        label: "End Date",
        type: "date",
      },
      phase_priority: {
        icon: "",
        label: "Priority",
        type: "int4",
      },
      is_current_phase: {
        icon: "",
        label: "Is Current Phase",
        type: "bool",
      },
      completed: {
        icon: "",
        label: "Completed",
        type: "bool",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      started_by_user_id: {
        icon: "",
        label: "Started By User ID",
        type: "int4",
      },
      completed_by_user_id: {
        icon: "",
        label: "Completed by User ID",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      project_phase_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
    },
  },

  moped_proj_sponsors: {
    label: "Project Sponsors",
    fields: {
      entity_id: {
        icon: "",
        label: "Entity ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      project_sponsor_id: {
        icon: "",
        label: "Project Sponsor ID",
        type: "uuid",
      },
      sponsor_website: {
        icon: "",
        label: "Website",
        type: "text",
      },
      sponsor_context: {
        icon: "",
        label: "Context",
        type: "text",
      },
      sponsor_context_file: {
        icon: "",
        label: "Context File",
        type: "text",
      },
      sponsor_description: {
        icon: "",
        label: "Description",
        type: "text",
      },
      is_external_sponsor: {
        icon: "",
        label: "Is External Sponsor",
        type: "bool",
      },
      sponsor_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      sponsor_allocation: {
        icon: "",
        label: "Allocation",
        type: "float4",
      },
    },
  },

  moped_proj_status_history: {
    label: "Status History",
    fields: {
      is_milestone_completed: {
        icon: "",
        label: "Is Milestone Completed",
        type: "bool",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_status_changed: {
        icon: "",
        label: "Status Changed",
        type: "date",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      project_status_history_id: {
        icon: "",
        label: "History ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      is_current_milestone: {
        icon: "",
        label: "Is Current Milestone",
        type: "bool",
      },
      milestone_privacy: {
        icon: "",
        label: "Privacy",
        type: "bool",
      },
      milestone_length: {
        icon: "",
        label: "Length",
        type: "int4",
      },
      milestone_end: {
        icon: "",
        label: "Date End",
        type: "date",
      },
      milestone_start: {
        icon: "",
        label: "Date Added",
        type: "date",
      },
      milestone_order: {
        icon: "",
        label: "Order",
        type: "int4",
      },
      milestone_description: {
        icon: "",
        label: "Description",
        type: "text",
      },
      milestone_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      status_name: {
        icon: "",
        label: "Status Name",
        type: "text",
      },
    },
  },

  moped_proj_status_notes: {
    label: "Project Status Notes",
    fields: {
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      proj_status_id: {
        icon: "",
        label: "Status ID",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      status_name: {
        icon: "",
        label: "Status Name",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      date_written: {
        icon: "",
        label: "Date Written",
        type: "date",
      },
      created_by_personnel: {
        icon: "",
        label: "Created By",
        type: "text",
      },
      status_note: {
        icon: "",
        label: "Note",
        type: "text",
      },
    },
  },

  moped_proj_timeline: {
    label: "Project Timeline",
    fields: {
      active_milestone_start: {
        icon: "",
        label: "Start Date",
        type: "date",
      },
      active_milestone_end: {
        icon: "",
        label: "Milestone End",
        type: "date",
      },
      active_milestone_length: {
        icon: "",
        label: "Milestone Length",
        type: "int4",
      },
      capital_projects_explorer_id: {
        icon: "",
        label: "Explorer ID",
        type: "text",
      },
      current_status: {
        icon: "",
        label: "Status ID",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      active_milestone: {
        icon: "",
        label: "Active Milestone",
        type: "text",
      },
      timeline_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      active_phase: {
        icon: "",
        label: "Active Phase",
        type: "text",
      },
      active_phase_start: {
        icon: "",
        label: "Active Phase Start Date",
        type: "date",
      },
      active_phase_end: {
        icon: "",
        label: "Active Phase End Date",
        type: "date",
      },
      active_phase_length: {
        icon: "",
        label: "Active Phase Length",
        type: "int4",
      },
    },
  },

  moped_project_roles: {
    label: "",
    fields: {
      project_role_name: {
        icon: "",
        label: "",
        type: "text",
      },
      project_role_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      active_role: {
        icon: "",
        label: "",
        type: "bool",
      },
      role_order: {
        icon: "",
        label: "",
        type: "int4",
      },
    },
  },

  moped_status: {
    label: "",
    fields: {
      status_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      status_priority: {
        icon: "",
        label: "",
        type: "int4",
      },
      status_flag: {
        icon: "",
        label: "",
        type: "int4",
      },
      status_name: {
        icon: "",
        label: "",
        type: "text",
      },
    },
  },
  moped_users: {
    label: "",
    fields: {
      first_name: {
        icon: "",
        label: "",
        type: "text",
      },
      last_name: {
        icon: "",
        label: "",
        type: "text",
      },
      title: {
        icon: "",
        label: "",
        type: "text",
      },
      workgroup: {
        icon: "",
        label: "",
        type: "text",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      staff_uuid: {
        icon: "",
        label: "",
        type: "uuid",
      },
      workgroup_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      cognito_user_id: {
        icon: "",
        label: "",
        type: "uuid",
      },
      email: {
        icon: "",
        label: "",
        type: "citext",
      },
      status_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      is_coa_staff: {
        icon: "",
        label: "",
        type: "bool",
      },
      user_id: {
        icon: "",
        label: "",
        type: "int4",
      },
    },
  },
  moped_workgroup: {
    label: "",
    fields: {
      workgroup_name: {
        icon: "",
        label: "",
        type: "text",
      },
      workgroup_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
    },
  },

  moped_proj_categories: {
    label: "Project Category",
    fields: {
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      category_name: {
        icon: "",
        label: "Name",
        type: "text",
      },
      added_by: {
        icon: "",
        label: "Added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        type: "timestamptz",
      },
      proj_category_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
    },
  },

  moped_proj_components: {
    label: "Project Component",
    fields: {
      // This should be renamed to project_id
      moped_project_id: {
        icon: "",
        label: "Project ID",
        data_type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        data_type: "int4",
      },
      moped_component_id: {
        icon: "",
        label: "Component ID",
        data_type: "int4",
      },
      component_length: {
        icon: "",
        label: "Length",
        data_type: "numeric",
      },
      component_notes: {
        icon: "",
        label: "Note",
        data_type: "text",
      },
      component_unique_id: {
        icon: "",
        label: "Unique ID",
        data_type: "text",
      },
      component_unique_id_code: {
        icon: "",
        label: "Unique ID Code",
        data_type: "text",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        data_type: "timestamptz",
      },
      moped_proj_component_id: {
        icon: "",
        label: "ID",
        data_type: "int4",
      },
      added_by: {
        icon: "",
        label: "Added By",
        data_type: "int4",
      },
    },
  },

  moped_proj_dates: {
    label: "Project Date",
    fields: {
      project_date: {
        icon: "",
        label: "Date",
        data_type: "date",
      },
      date_type: {
        icon: "",
        label: "Type",
        data_type: "text",
      },
      date_year: {
        icon: "",
        label: "Year",
        data_type: "int4",
      },
      date_month: {
        icon: "",
        label: "Month",
        data_type: "int4",
      },
      date_day: {
        icon: "",
        label: "Day",
        data_type: "int4",
      },
      active_date: {
        icon: "",
        label: "Date",
        data_type: "bool",
      },
      date_id: {
        icon: "",
        label: "OD",
        data_type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        data_type: "int4",
      },
      date_added: {
        icon: "",
        label: "Date Added",
        data_type: "timestamptz",
      },
      project_milestone_id: {
        icon: "",
        label: "Milestone ID",
        data_type: "int4",
      },
      project_phase_id: {
        icon: "",
        label: "Phase ID",
        data_type: "int4",
      },
      added_by: {
        icon: "",
        label: "Added By",
        data_type: "int4",
      },
    },
  },
};

export const ProjectActivityLogOperationMaps = {
  DELETE: {
    label: "Deleted",
    icon: "close",
  },
  INSERT: {
    label: "Created",
    icon: "beenhere",
  },
  UPDATE: {
    label: "Update",
    icon: "create",
  },
};

export const ProjectActivityLogGenericDescriptions = {
  project_extent_ids: {
    label: "Project extent updated",
  },
  project_extent_geojson: {
    label: "Project GeoJSON updated",
  },
};

/**
 * Returns a human-readable field name (translates the column into a readable label)
 * @param {string} type - The table name
 * @param {string} field - The column name
 * @return {string}
 */
export const getHumanReadableField = (type, field) => {
  return (
    ProjectActivityLogTableMaps[type.toLowerCase()]?.fields[field.toLowerCase()]
      ?.label ?? field
  );
};

/**
 * Returns the
 * @param {string} type - The name of the table
 * @return {string}
 */
export const getRecordTypeLabel = type => {
  return ProjectActivityLogTableMaps[type.toLowerCase()]?.label ?? type;
};

/**
 * Returns the icon to be used for a specific line, if the field is empty, it defaults to the table's icon
 * @param {string} type
 * @param {string} field
 * @return {string}
 */
export const getChangeIcon = type => {
  return ProjectActivityLogOperationMaps[type]?.icon ?? "create";
};

/**
 * Translates the operation type value into friendly label
 * @param {string} operationName - The operation type: INSERT, UPDATE, DELETE
 * @return {string}
 */
export const getOperationName = operationName => {
  return (
    ProjectActivityLogOperationMaps[operationName.toUpperCase()]?.label ??
    "Unknown"
  );
};

export const PLACEHOLDER_QUERY = gql`
  query NotARealQuery {
    just_a_placeholder {
      affected_rows
    }
  }
`;

/**
 * Takes an array of table names and uses ProjectActivityLogTableMaps to create a query for lookup tables
 * @param {array} tableNames - Names of table with field that requires a lookup
 * @return {query} A GraphQL query document parsed by gql.
 */
export const buildLookupQuery = tableNames => {
  const noLookupsObject = {
    areLookups: false,
    query: PLACEHOLDER_QUERY,
  };

  if (!tableNames || tableNames.length === 0) return noLookupsObject;

  const lookupQueries = tableNames.map(tableName => {
    const fields = ProjectActivityLogTableMaps[tableName].fields;

    const lookupFields = Object.values(fields).filter(value =>
      value.hasOwnProperty("lookup")
    );

    const tableQueries = lookupFields.map(field => {
      const { table, fieldLabel, fieldValue } = field.lookup;

      // Alias table name as fieldLabel and return values as key and value to create lookup objects later
      return `
      ${fieldLabel}: ${table} {
        key: ${fieldLabel}
        value: ${fieldValue}
      }
      `;
    });

    return tableQueries;
  });

  const flatLookupQueries = lookupQueries.flat();

  if (flatLookupQueries.length === 0) return noLookupsObject;

  const lookupQueriesString = flatLookupQueries.join(" ");
  const LOOKUPS_QUERY = gql`
    query RetrieveLookupValues { 
      ${lookupQueriesString} 
    }
  `;

  return { areLookups: true, query: LOOKUPS_QUERY };
};

/**
 * Take activity log response and return unique table names for lookup in project's log
 * @param {object} response - GraphQL response containing project record types (table names)
 * @return {array} Array of unique table names for log data lookups
 */ export const getActivityLogTableNames = response => {
  const lookupTableData = response?.activity_log_lookup_tables;

  if (!lookupTableData || lookupTableData.length === 0) return null;

  const tableNames = lookupTableData.map(record => record.record_type);

  return tableNames;
};
