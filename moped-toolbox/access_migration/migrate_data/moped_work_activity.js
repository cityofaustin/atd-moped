const { logger } = require("./utils/logger");
const { loadJsonFile } = require("./utils/loader");
const { mapRowExpanded } = require("./utils/misc");
const { USERS_FNAME } = require("./moped_users");
const { logger } = require("./utils/logger");
const WORK_AUTH_FNAME = "./data/raw/workauthorizations.json";
const WORK_AUTHS = loadJsonFile(WORK_AUTH_FNAME);
const USERS = loadJsonFile(USERS_FNAME);
let TASK_ORDERS;

// Moped status IDs
// 1: planned (default)
// 2: under_construction
// 3: complete
// 4: canceled
// 5: on_hold

const STATUS_ID_MAP = {
  "0-Complete": 3,
  "1-Under Construction": 2,
  "2-Ready to Build": 1,
  "3-In Development": 1,
  "3-Likely Soon": 1,
  "4-On Hold": 5,
  "5-Future / Potential": 1,
  "6-Canceled": 4,
};

const fields = [
  {
    in: "ProjectID",
    out: "interim_project_id",
    required: true,
  },
  {
    in: "WorkOrderID_Old",
    out: "interim_work_activity_id",
    transform: (oldRow, newRow) => {
      // if there is an "old" ID—use that
      let activityId = oldRow.WorkOrderID_Old;
      if (!activityId) {
        // construct the "old" id from the prefix and ID sequence
        // this is the convention used in the access DB
        activityId = `${oldRow.WAPrefix}-${oldRow.WorkAuthorizationID}`
        if (!oldRow.WAPrefix || !oldRow.WorkAuthorizationID) {
          throw `Cannot construct work activity ID - wtf?`
        }
      }
      newRow.interim_work_activity_id = activityId
    },
  },
  {
    in: "DO_Number",
    out: "contract_number",
  },
  {
    in: "ImplementationGroup",
    // out: "implementation_workgroup",
    out: "contractor",
  },
  {
    in: "Description",
    out: "description",
  },
  {
    in: "TaskOrder",
    out: "task_orders",
    transform: (oldRow, newRow) => {
      const taskOrder = oldRow.TaskOrder?.trim().replaceAll(" ");
      if (!taskOrder) {
        return;
      }
      const matchedTaskOrder = TASK_ORDERS.find(
        (tk) => tk.task_order === taskOrder
      );
      if (matchedTaskOrder) {
        // array-ify task order, since multiple are allowed in Moped
        newRow.task_orders = [matchedTaskOrder];
      } else {
        // todo
        logger.info("⚠️ Ignoring unknown task order: ", taskOrder);
        // throw `not sure what to do with unknown tks`;
      }
    },
  },
  {
    in: "StatusID",
    out: "status_id",
    transform: (oldRow, newRow) => {
      const statusIdOld = oldRow.StatusId;
      const statusIdNew = STATUS_ID_MAP[statusIdOld] || 1;
      newRow.status_id = statusIdNew;
    },
  },
  {
    in: "Status",
    out: "status_note",
    transform(oldRow, newRow) {
      // get the status note
      let statusNote = oldRow.status_note || "";
      // get other properties if they exist
      const schematicStatus = oldRow.SchematicStatus;
      const followup = oldRow.Followup;
      if (schematicStatus) {
        statusNote = `${statusNote}\nSchematic Status: ${schematicStatus}`;
      }
      if (followup) {
        statusNote = `${statusNote}\nFollow-up: ${followup}`;
      }
      newRow.status_note = statusNote || null;
    },
  },
  {
    in: "SubmittedBy",
    transform: (oldRow, newRow) => {
      const submittedByUser = oldRow.SubmittedBy;
      if (!submittedByUser) {
        return;
      }
      const matchedUser = USERS.find(
        (user) =>
          `${user.first_name} ${user.last_name}`.toLowerCase() ===
          submittedByUser.toLowerCase()
      );
      if (!matchedUser) {
        console.log("USER NOT FOUND: ", submittedByUser);
        throw `User not found`;
        debugger;
      }
      newRow.created_by_user_id = matchedUser.user_id;
      newRow.updated_by_user_id = matchedUser.user_id;
    },
  },
];

async function downloadTaskOrders() {
  logger.info("Downloading task orders...");
  const endpoint =
    "https://data.austintexas.gov/resource/ggav-ufvc.json?$limit=10000000";
  const response = await fetch(endpoint, {
    method: "GET",
  });
  TASK_ORDERS = await response.json();
  if (TASK_ORDERS.length < 10000) {
    // something is wrong - should be 10k tks
    throw `Task order data error`;
  } else {
    logger.info(`✅ ${TASK_ORDERS.length} task orders downloaded.`);
  }
}

async function getWorkActivities() {
  await downloadTaskOrders();
  return (
    WORK_AUTHS.filter((row) => row.ProjectID)
      // exclude any records with no ProjectID (there are ~100)
      .map((row) => mapRowExpanded(row, fields))
  );

  //   const activityIndex = activties.reduce(
  //     (index, { interim_project_id, ...activityProps }) => {
  //       index[interim_project_id] = activityProps;
  //       return index;
  //     },
  //     {}
  //   );
  //   return activityIndex;
}

exports.getWorkActivities = getWorkActivities;
