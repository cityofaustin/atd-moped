export const ProjectActivityLogTableMaps = {
  moped_project: {
    label: "Project",
    fields: {
      project_name: {
        label: "name",
      },
      project_description: {
        label: "description",
      },
      ecapris_subproject_id: {
        label: "eCAPRIS subproject ID",
      },
      current_status: {
        label: "current status",
      },
      current_phase: {
        label: "phase",
      },
      is_deleted: {
        label: "soft delete status",
      },
      milestone_id: {
        label: "milestone ID",
      },
      status_id: {
        label: "status ID",
      },
      // deprecated column, but keeping because historical activities depend on it
      contractor: {
        label: "contractor",
      },
      project_sponsor: {
        label: "project sponsor",
        lookup: "moped_entity",
      },
      public_process_status_id: {
        label: "public process status",
        lookup: "moped_public_process_statuses",
      },
      project_website: {
        label: "project website",
      },
      knack_project_id: {
        label: "Knack internal ID",
      },
      // deprecated column, but keeping because historical activities depend on it
      purchase_order_number: {
        label: "purchase order number",
      },
      task_order: {
        label: "task order",
      },
      // deprecated column, but keeping because historical activities depend on it
      work_assignment_id: {
        label: "work assignment ID",
      },
      parent_project_id: {
        label: "parent project id",
      },
      interim_project_id: {
        label: "Interim MPD (Access) ID",
      },
      project_lead_id: {
        label: "project lead",
        lookup: "moped_entity",
      },
      capitally_funded: {
        label: "capitally funded",
      },
      is_retired: {
        label: "is retired",
      },
    },
  },
  moped_proj_entities: {
    label: "Entity",
    fields: {
      project_sponsors: {
        icon: "",
        label: "sponsor",
        type: "text",
      },
      entity_list_id: {
        icon: "",
        label: "list ID",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "date added",
        type: "timestamptz",
      },
      project_id: {
        icon: "",
        label: "ID",
        type: "int4",
      },
      project_personnel: {
        icon: "",
        label: "personnel",
        type: "text",
      },
      workgroups: {
        icon: "",
        label: "work groups",
        type: "int4",
      },
      partners: {
        icon: "",
        label: "partners",
        type: "text",
      },
      project_groups: {
        icon: "",
        label: "groups",
        type: "bpchar",
      },
    },
  },
  moped_proj_milestones: {
    label: "Milestone",
    fields: {
      milestone_end: {
        label: "date actual",
      },
      date_actual: {
        label: "date actual",
      },
      project_id: {
        label: "project ID",
      },
      milestone_id: {
        label: "id",
      },
      project_milestone_id: {
        label: "ID",
      },
      completed: {
        label: "completion",
      },
      milestone_order: {
        label: "order",
      },
      milestone_description: {
        label: "description",
      },
      description: {
        label: "description",
      },
      milestone_name: {
        label: "name",
      },
      date_added: {
        label: "date added",
      },
      milestone_estimate: {
        label: "completion estimate",
      },
      date_estimate: {
        label: "completion estimate",
      },
      is_deleted: {
        label: "is deleted",
      },
    },
  },
  moped_proj_notes: {
    label: "Note",
    fields: {
      // todo: this column has been deprecated. we should remove it from here and use a gracefull fallback handler
      added_by: {
        label: "added by",
      },
      project_id: {
        label: "project ID",
      },
      project_note_id: {
        label: "note ID",
      },
      date_created: {
        label: "date created",
      },
      project_note: {
        label: "note",
      },
      is_deleted: {
        label: "is deleted",
      },
      added_by_user_id: {
        label: "added by user ID",
      },
      project_note_type: {
        label: "note type",
      },
    },
  },
  moped_proj_partners: {
    label: "Partner",
    fields: {
      added_by: {
        icon: "",
        label: "added By",
        type: "int4",
      },
      date_added: {
        icon: "",
        label: "date added",
        type: "timestamptz",
      },
      proj_partner_id: {
        icon: "",
        label: "partner ID",
        type: "int4",
      },
      // deprecated column, but keeping because historical activities depend on it
      partner_name: {
        icon: "",
        label: "name",
        type: "text",
      },
      entity_id: {
        icon: "",
        label: "entity ID",
        type: "int4",
      },
      project_id: {
        icon: "",
        label: "project ID",
        type: "int4",
      },
      is_deleted: {
        icon: "",
        label: "is deleted",
        type: "boolean",
      },
    },
  },
  moped_proj_personnel: {
    label: "Team",
    fields: {
      added_by: {
        label: "added by",
      },
      date_added: {
        label: "date added",
      },
      project_personnel_id: {
        label: "ID",
      },
      notes: {
        label: "notes",
      },
      is_deleted: {
        label: "is deleted",
      },
      project_id: {
        label: "project ID",
      },
      role_id: {
        label: "role",
      },
      user_id: {
        label: "user",
      },
    },
  },
  moped_proj_phases: {
    label: "Phases",
    fields: {
      phase_order: {
        label: "order",
      },
      phase_id: {
        label: "phase",
      },
      phase_description: {
        label: "description",
      },
      completion_percentage: {
        label: "completion percentage",
      },
      phase_status: {
        label: "status",
      },
      phase_privacy: {
        label: "privacy",
      },
      phase_start: {
        label: "start date",
      },
      phase_end: {
        label: "end date",
      },
      phase_priority: {
        label: "priority",
      },
      is_current_phase: {
        label: "current phase marker",
      },
      completed: {
        label: "completed",
      },
      project_id: {
        label: "project ID",
      },
      started_by_user_id: {
        label: "started by user ID",
      },
      completed_by_user_id: {
        label: "completed by user ID",
      },
      date_added: {
        label: "date added",
      },
      project_phase_id: {
        label: "ID",
      },
      is_deleted: {
        label: "is deleted",
      },
      subphase_id: {
        label: "subphase",
      },
      is_phase_start_confirmed: {
        label: "start date confirmation"
      },
      is_phase_end_confirmed: {
        label: "end date confirmation"
      }
    },
  },
  moped_proj_components: {
    label: "Component",
    fields: {
      project_id: {
        label: "ID",
      },
      project_component_id: {
        label: "component ID",
      },
      component_id: {
        label: "component ID",
      },
      description: {
        label: "description",
      },
      is_deleted: {
        label: "is deleted",
      },
      phase_id: {
        label: "component phase",
      },
      subphase_id: {
        label: "component subphase",
      },
      completion_date: {
        label: "completion date",
      },
      location_description: {
        label: "location description",
      },
      srts_id: {
        label: "Safe Routes to School infrastructure plan record identifier",
      },
    },
  },
  moped_project_files: {
    label: "File",
    fields: {
      project_file_id: {
        icon: "",
        label: "ID",
        data_type: "int4",
      },
      project_id: {
        icon: "",
        label: "Project ID",
        data_type: "int4",
      },
      file_key: {
        icon: "",
        label: "file name",
        data_type: "text",
      },
      file_name: {
        icon: "",
        label: "title",
        data_type: "text",
      },
      file_description: {
        icon: "",
        label: "description",
        data_type: "text",
      },
      file_size: {
        icon: "",
        label: "size",
        data_type: "int4",
      },
      file_permissions: {
        icon: "",
        label: "permissions",
        data_type: "jsonb",
      },
      file_metadata: {
        icon: "",
        label: "metadata",
        data_type: "jsonb",
      },
      api_response: {
        icon: "",
        label: "API response",
        data_type: "jsonb",
      },
      created_by: {
        icon: "",
        label: "created by",
        data_type: "int4",
      },
      create_date: {
        icon: "",
        label: "create date",
        data_type: "date",
      },
      is_scanned: {
        icon: "",
        label: "scanned flag",
        data_type: "bool",
      },
      is_deleted: {
        icon: "",
        label: "deleted flag",
        data_type: "bool",
      },
      file_type: {
        icon: "",
        label: "file type",
        data_type: "integer",
      },
      file_url: {
        icon: "",
        label: "file link",
        data_type: "text",
      },
    },
  },
  moped_proj_funding: {
    label: "Fund",
    fields: {
      proj_funding_id: {
        label: "ID",
      },
      project_id: {
        label: "project ID",
      },
      date_added: {
        label: "date added",
      },
      added_by: {
        label: "added by",
      },
      funding_source_id: {
        label: "source",
        lookup: "fundingSources",
      },
      funding_program_id: {
        label: "program",
        lookup: "fundingPrograms",
      },
      funding_amount: {
        label: "amount",
      },
      fund_dept_unit: {
        label: "fund department unit",
      },
      funding_description: {
        label: "fund description",
      },
      funding_status_id: {
        label: "status",
        lookup: "fundingStatus",
      },
      is_deleted: {
        label: "is deleted",
      },
      fund: {
        label: "fund",
      },
      dept_unit: {
        label: "department unit",
      },
    },
  },
  moped_project_types: {
    label: "Type",
    fields: {
      project_id: {
        icon: "",
        label: "project ID",
        data_type: "integer",
      },
      project_type_id: {
        icon: "",
        label: "project type ID",
        data_type: "integer",
      },
      date_added: {
        icon: "",
        label: "date added",
        data_type: "timestamptz",
      },
      added_by: {
        icon: "",
        label: "added by",
        data_type: "integer",
      },
      id: {
        icon: "",
        label: "ID",
        data_type: "integer",
      },
      is_deleted: {
        icon: "",
        label: "is deleted",
        data_type: "boolean",
      },
    },
  },
  moped_proj_tags: {
    fields: {
      tag_id: {
        label: "Tag ID",
      },
    },
  },
  moped_proj_work_activity: {
    label: "Contract",
    fields: {
      id: {
        label: "ID",
      },
      contractor: {
        label: "workgroup/contractor",
      },
      contract_number: {
        label: "contract number",
      },
      description: {
        label: "description",
      },
      project_id: {
        label: "project ID",
      },
      work_assignment_id: {
        label: "work assignment ID",
      },
      contract_amount: {
        label: "contract amount",
      },
      is_deleted: {
        label: "is deleted",
      },
      interim_work_activity_id: {
        label: "interim work activity ID",
      },
      implementation_workgroup: {
        label: "implementation workgroup",
      },
      task_orders: {
        label: "task orders",
      },
      status_id: {
        label: "status",
      },
      status_note: {
        label: "status note",
      },
      work_order_url: {
        label: "work order link",
      },
    },
  },
};
