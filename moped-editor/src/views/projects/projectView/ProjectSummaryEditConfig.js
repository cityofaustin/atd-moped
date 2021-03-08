export const crashDataMap = {
  title: "Details",
  fields: {
    crash_id: {
      label: "Crash ID",
      editable: false,
    },
    last_update: {
      label: "Last Updated",
      editable: false,
      format: "datetime",
    },
    case_id: {
      label: "Case ID",
      editable: false,
    },
    crash_date: {
      label: "Crash Date",
      editable: false,
    },
    crash_time: {
      label: "Crash Time",
      editable: false,
    },
    day_of_week: {
      label: "Day of Week",
      editable: false,
    },
    est_comp_cost: {
      label: "Est. Comprehensive Cost",
      editable: false,
      format: "dollars",
    },
    est_econ_cost: {
      label: "Est. Economic Cost",
      editable: false,
      format: "dollars",
    },
    speed_mgmt_points: {
      label: "Speed Management Points",
      editable: false,
      format: "text",
    },
    fhe_collsn_id: {
      label: "Manner of Collision ID",
      editable: false,
      uiType: "select",
      lookupOptions: "atd_txdot__collsn_lkp",
      lookupPrefix: "collsn", // We need this field so we can reference the collsn_id & collsn_desc fields in the lookup table
    },
    city_id: {
      label: "City",
      editable: true,
      uiType: "select",
      lookupOptions: "atd_txdot__city_lkp",
      lookupPrefix: "city",
    },
    light_cond_id: {
      label: "Light Condition",
      editable: false,
      uiType: "select",
      lookupOptions: "atd_txdot__light_cond_lkp",
    },
    wthr_cond_id: {
      label: "Weather Condition",
      editable: false,
      uiType: "select",
      lookupOptions: "atd_txdot__wthr_cond_lkp",
    },
    obj_struck_id: {
      label: "Object Struck",
      editable: false,
      uiType: "select",
      lookupOptions: "atd_txdot__obj_struck_lkp",
    },
    crash_speed_limit: {
      label: "Speed Limit",
      editable: true,
      // TODO: Validate for integers
      uiType: "text",
    },
    road_type_id: {
      label: "Roadway Type",
      editable: true,
      uiType: "select",
      lookupOptions: "atd_txdot__road_type_lkp",
    },
    traffic_cntl_id: {
      label: "Traffic Control",
      editable: true,
      uiType: "select",
      lookupOptions: "atd_txdot__traffic_cntl_lkp",
    },
  },
};
