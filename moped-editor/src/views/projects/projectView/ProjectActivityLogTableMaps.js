export const ProjectActivityLogTableMaps = {
  moped_project: {
    label: "Project's",
    fields: {
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
      current_status: {
        label: "Current Status",
        icon: "",
        data_type: "text",
      },
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
      project_priority: {
        label: "Priority",
        icon: "",
        data_type: "text",
      },
      date_added: {
        label: "Date Added",
        icon: "",
        data_type: "timestamp with time zone",
      },
      added_by: { label: "Added by", icon: "", data_type: "integer" },
      project_extent_ids: {
        label: "Extent",
        icon: "",
        data_type: "jsonb",
      },
      project_extent_geojson: {
        label: "Extent GeoJson Data",
        icon: "",
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
    label: "",
    fields: {
      role_order: {
        icon: "",
        label: "",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      project_personnel_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      workgroup_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      project_personnel_user_id: {
        icon: "",
        label: "",
        type: "int4",
      },
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
      notes: {
        icon: "",
        label: "",
        type: "text",
      },
      join_date: {
        icon: "",
        label: "",
        type: "date",
      },
      status: {
        icon: "",
        label: "",
        type: "text",
      },
      allocation: {
        icon: "",
        label: "",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      workgroup: {
        icon: "",
        label: "",
        type: "text",
      },
      role_name: {
        icon: "",
        label: "",
        type: "text",
      },
    },
  },

  moped_proj_phases: {
    label: "",
    fields: {
      phase_rank: {
        icon: "",
        label: "",
        type: "int4",
      },
      phase_name: {
        icon: "",
        label: "",
        type: "text",
      },
      phase_description: {
        icon: "",
        label: "",
        type: "text",
      },
      completion_percentage: {
        icon: "",
        label: "",
        type: "int4",
      },
      phase_status: {
        icon: "",
        label: "",
        type: "text",
      },
      phase_privacy: {
        icon: "",
        label: "",
        type: "bool",
      },
      phase_start: {
        icon: "",
        label: "",
        type: "date",
      },
      phase_end: {
        icon: "",
        label: "",
        type: "date",
      },
      phase_priority: {
        icon: "",
        label: "",
        type: "int4",
      },
      is_current_phase: {
        icon: "",
        label: "",
        type: "bool",
      },
      completed: {
        icon: "",
        label: "",
        type: "bool",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      started_by_user_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      completed_by_user_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      project_phase_id: {
        icon: "",
        label: "",
        type: "int4",
      },
    },
  },

  moped_proj_sponsors: {
    label: "",
    fields: {
      entity_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      project_sponsor_id: {
        icon: "",
        label: "",
        type: "uuid",
      },
      sponsor_website: {
        icon: "",
        label: "",
        type: "text",
      },
      sponsor_context: {
        icon: "",
        label: "",
        type: "text",
      },
      sponsor_context_file: {
        icon: "",
        label: "",
        type: "text",
      },
      sponsor_description: {
        icon: "",
        label: "",
        type: "text",
      },
      is_external_sponsor: {
        icon: "",
        label: "",
        type: "bool",
      },
      sponsor_name: {
        icon: "",
        label: "",
        type: "text",
      },
      sponsor_allocation: {
        icon: "",
        label: "",
        type: "float4",
      },
    },
  },

  moped_proj_status_history: {
    label: "",
    fields: {
      is_milestone_completed: {
        icon: "",
        label: "",
        type: "bool",
      },
      added_by: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_status_changed: {
        icon: "",
        label: "",
        type: "date",
      },
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      project_status_history_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      is_current_milestone: {
        icon: "",
        label: "",
        type: "bool",
      },
      milestone_privacy: {
        icon: "",
        label: "",
        type: "bool",
      },
      milestone_length: {
        icon: "",
        label: "",
        type: "int4",
      },
      milestone_end: {
        icon: "",
        label: "",
        type: "date",
      },
      milestone_start: {
        icon: "",
        label: "",
        type: "date",
      },
      milestone_order: {
        icon: "",
        label: "",
        type: "int4",
      },
      milestone_description: {
        icon: "",
        label: "",
        type: "text",
      },
      milestone_name: {
        icon: "",
        label: "",
        type: "text",
      },
      status_name: {
        icon: "",
        label: "",
        type: "text",
      },
    },
  },

  moped_proj_status_notes: {
    label: "",
    fields: {
      date_added: {
        icon: "",
        label: "",
        type: "timestamptz",
      },
      proj_status_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      added_by: {
        icon: "",
        label: "",
        type: "int4",
      },
      status_name: {
        icon: "",
        label: "",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      date_written: {
        icon: "",
        label: "",
        type: "date",
      },
      created_by_personnel: {
        icon: "",
        label: "",
        type: "text",
      },
      status_note: {
        icon: "",
        label: "",
        type: "text",
      },
    },
  },

  moped_proj_timeline: {
    label: "",
    fields: {
      active_milestone_start: {
        icon: "",
        label: "",
        type: "date",
      },
      active_milestone_end: {
        icon: "",
        label: "",
        type: "date",
      },
      active_milestone_length: {
        icon: "",
        label: "",
        type: "int4",
      },
      capital_projects_explorer_id: {
        icon: "",
        label: "",
        type: "text",
      },
      current_status: {
        icon: "",
        label: "",
        type: "text",
      },
      project_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      active_milestone: {
        icon: "",
        label: "",
        type: "text",
      },
      timeline_id: {
        icon: "",
        label: "",
        type: "int4",
      },
      active_phase: {
        icon: "",
        label: "",
        type: "text",
      },
      active_phase_start: {
        icon: "",
        label: "",
        type: "date",
      },
      active_phase_end: {
        icon: "",
        label: "",
        type: "date",
      },
      active_phase_length: {
        icon: "",
        label: "",
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
