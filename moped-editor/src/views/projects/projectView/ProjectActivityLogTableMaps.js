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
      ecapris_subproject_id: {
        label: "eCAPRIS subproject ID",
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
      is_retired: {
        icon: "",
        label: "Is Retired?",
        data_type: "bool",
      },
      milestone_id: {
        icon: "",
        label: "Milestone ID",
        data_type: "integer",
      },
      status_id: {
        icon: "",
        label: "Status ID",
        data_type: "integer",
      },
      updated_at: {
        icon: "",
        label: "Updated Timestamp",
        data_type: "timestamp with time zone",
      },
      contractor: {
        icon: "",
        label: "Contractor",
        data_type: "text",
      },
      project_sponsor: {
        icon: "",
        label: "Project Sponsor ID",
        data_type: "integer",
      },
      project_website: {
        icon: "",
        label: "Project Website",
        data_type: "text",
      },
      knack_project_id: {
        icon: "",
        label: "Knack Internal ID",
        data_type: "text",
      },
      purchase_order_number: {
        icon: "",
        label: "Purchase Order Number",
        data_type: "text",
      },
      task_order: {
        icon: "",
        label: "Task Order",
        data_type: "jsonb",
      },
      work_assignment_id: {
        icon: "",
        label: "Work Assignment ID",
        data_type: "text",
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
  moped_proj_milestones: {
    label: "Project Milestone",
    fields: {
      milestone_end: {
        icon: "",
        label: "End Date",
        type: "date",
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
      milestone_privacy: {
        icon: "",
        label: "Privacy Flag",
        type: "bool",
      },
      milestone_start: {
        icon: "",
        label: "Start Date",
        type: "date",
      },
      completion_percentage: {
        icon: "",
        label: "Completion Percentage",
        type: "integer",
      },
      milestone_status: {
        icon: "",
        label: "Milestone Status",
        type: "text",
      },
      milestone_priority: {
        icon: "",
        label: "Milestone Priority",
        type: "integer",
      },
      milestone_date_type: {
        icon: "",
        label: "Milestone Date Type",
        type: "text",
      },
      milestone_related_phase_id: {
        icon: "",
        label: "Milestone Related Phase ID",
        type: "integer",
      },
      started_by_user_id: {
        icon: "",
        label: "Started by User ID",
        type: "integer",
      },
      completed_by_user_id: {
        icon: "",
        label: "Completed by User ID",
        type: "integer",
      },
      milestone_estimate: {
        icon: "",
        label: "Milestone Estimate",
        type: "timestampz",
      },
      status_id: {
        icon: "",
        label: "Status ID",
        type: "integer",
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
      status_id: {
        icon: "",
        label: "Status ID",
        type: "integer",
      },      
      added_by_user_id: {
        icon: "",
        label: "Added by User ID",
        type: "integer",
      },
      project_note_type: {
        icon: "",
        label: "Project Note Type",
        type: "integer",
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
      status_id: {
        icon: "",
        label: "Status ID",
        type: "integer",
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
        map: {
          0: "Inactive",
          1: "Active",
        },
      },
      project_id: {
        icon: "",
        label: "Project ID",
        type: "int4",
      },
      role_id: {
        icon: "",
        label: "Role",
        type: "int4",
        lookup: {
          table: "moped_project_roles",
          fieldLabel: "project_role_id",
          fieldValues: ["project_role_name"],
        },
      },
      user_id: {
        icon: "",
        label: "User",
        type: "int4",
        lookup: {
          table: "moped_users",
          fieldLabel: "user_id",
          fieldValues: ["first_name", "last_name"],
        },
      },
    },
  },
  moped_proj_phases: {
    label: "Project Phases",
    fields: {
      phase_order: {
        icon: "",
        label: "Order",
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
      status_id: {
        icon: "",
        label: "Status ID",
        type: "integer",
      },
      subphase_name: {
        icon: "",
        label: "Subphase Name",
        type: "text",
      },
      subphase_id: {
        icon: "",
        label: "Subphase ID",
        type: "integer",
      }
    },
  },
  moped_proj_components: {
    label: "Project Component",
    fields: {
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
      component_id: {
        icon: "",
        label: "Component ID",
        data_type: "integer",
      },
      name: {
        icon: "",
        label: "Name",
        data_type: "text",
      },
      description: {
        icon: "",
        label: "Description",
        data_type: "text",
      },
      status_id: {
        icon: "",
        label: "Status ID",
        data_type: "integer",
      },
    },
  },
  moped_project_files: {
    label: "Project File",
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
        label: "Storage File Name",
        data_type: "text",
      },
      file_name: {
        icon: "",
        label: "Title",
        data_type: "text",
      },
      file_description: {
        icon: "",
        label: "Description",
        data_type: "text",
      },
      file_size: {
        icon: "",
        label: "File Size",
        data_type: "int4",
      },
      file_permissions: {
        icon: "",
        label: "File Permissions",
        data_type: "jsonb",
      },
      file_metadata: {
        icon: "",
        label: "File Metadata",
        data_type: "jsonb",
      },
      api_response: {
        icon: "",
        label: "API Response",
        data_type: "jsonb",
      },
      created_by: {
        icon: "",
        label: "Created By",
        data_type: "int4",
      },
      create_date: {
        icon: "",
        label: "Create Date",
        data_type: "date",
      },
      is_scanned: {
        icon: "",
        label: "Marked Scanned",
        data_type: "bool",
      },
      is_retired: {
        icon: "",
        label: "Marked Deleted",
        data_type: "bool",
      },
    },
  },
  moped_proj_funding: {
  },
  moped_project_types: {
  },
};

export const ProjectActivityLogOperationMaps = {
  moped_project: {
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
  },

  moped_proj_personnel: {
    DELETE: {
      label: "Removed",
      icon: "close",
    },
    INSERT: {
      label: "Added",
      icon: "personadd",
    },
    UPDATE: {
      label: "Updated",
      icon: "create",
    },
  },

  moped_proj_phases: {
    DELETE: {
      label: "Removed",
      icon: "close",
    },
    INSERT: {
      label: "Added",
      icon: "event",
    },
    UPDATE: {
      label: "Updated",
      icon: "create",
    },
  },

  moped_project_files: {
    DELETE: {
      label: "Deleted",
      icon: "close",
    },
    INSERT: {
      label: "Added",
      icon: "description",
    },
    UPDATE: {
      label: "Updated",
      icon: "create",
    },
  },

  generic: {
    DELETE: {
      label: "Deleted",
      icon: "close",
    },
    INSERT: {
      label: "Created",
      icon: "addcircle",
    },
    UPDATE: {
      label: "Update",
      icon: "create",
    },
  },
};

export const ProjectActivityLogGenericDescriptions = {
  project_extent_geojson: {
    label: "Project GeoJSON updated",
  },
};

export const ProjectActivityLogCreateDescriptions = {
  moped_project: {
    label: () => "Created Project",
  },
  moped_proj_personnel: {
    label: (record, userList) =>
      userList[`${record.record_data.event.data.new.user_id}`] +
      " to Project Personnel",
  },
  moped_proj_phases: {
    label: record => {
      const recordData = record.record_data.event.data.new;
      const phaseName = recordData.phase_name
        .trim()
        .toLowerCase()
        .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
      return `'${phaseName}' as Project Phase with start date as '${recordData.phase_start}' and end date as '${recordData.phase_end}'`;
    },
  },
  moped_project_files: {
    label: record => `New file '${record.record_data.event.data.new.file_name}'`,
  },
  generic: {
    label: () => "Added",
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
 * Returns true if a specific field is mapped
 * @param {string} type - The table name
 * @param {string} field - The column name
 * @return {boolean}
 */
export const isFieldMapped = (type, field) =>
  (ProjectActivityLogTableMaps[type.toLowerCase()]?.fields[field.toLowerCase()]
    ?.map ?? null) !== null;

/**
 * Returns the mapped value within the configuration
 * @param {string} type - The table name
 * @param {string} field - The column name
 * @param {*} value - Usually an integer but it can be a string
 * @return {string}
 */
export const getMappedValue = (type, field, value) =>
  ProjectActivityLogTableMaps[type.toLowerCase()]?.fields[field.toLowerCase()]
    ?.map[value];

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
 * @param {string} event_type - The operation type: INSERT, UPDATE, DELETE
 * @param {string} record_type - The name of the table
 * @return {string}
 */
export const getChangeIcon = (event_type, record_type = "moped_project") => {
  const recordType =
    record_type in ProjectActivityLogOperationMaps ? record_type : "generic";
  return (
    ProjectActivityLogOperationMaps[recordType][event_type.toUpperCase()]
      ?.icon ?? "create"
  );
};

/**
 * Translates the operation type value into friendly label
 * @param {string} event_type - The operation type: INSERT, UPDATE, DELETE
 * @param {string} record_type - The name of the table
 * @return {string}
 */
export const getOperationName = (event_type, record_type = "moped_project") => {
  const recordType =
    record_type in ProjectActivityLogOperationMaps ? record_type : "generic";
  return (
    ProjectActivityLogOperationMaps[recordType][event_type.toUpperCase()]
      ?.label ?? "Unknown"
  );
};

/**
 * Translates the operation type value into friendly label when there is no specified difference
 * @param {string} record - The event record
 * @return {string}
 */
export const getCreationLabel = (record, userList) => {
  const recordType =
    record.record_type in ProjectActivityLogCreateDescriptions
      ? record.record_type
      : "generic";

  const label = ProjectActivityLogCreateDescriptions[recordType]?.label ?? null;

  return label ? label(record, userList) : "Created";
};
