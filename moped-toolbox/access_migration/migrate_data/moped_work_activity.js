const { loadJsonFile } = require("./utils/loader");
const { mapRow, mapRowExpanded } = require("./utils/misc");

const WORK_AUTH_FNAME = "./data/raw/workauthorizations.json";
const WORK_AUTHS = loadJsonFile(WORK_AUTH_FNAME);

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
    out: "interim_work_order_id_old",
  },
  {
    in: "DO_Number",
    out: "contract_number",
  },
  {
    in: "ImplementationGroup",
    out: "implementation_workgroup",
  },
  {
    in: "Description",
    out: "description",
  },
  //   {
  //     in: "TaskOrder",
  //     out: "task_orders",
  //     transform: () => {
  //       throw `TODO`;
  //     },
  //   },
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
];

// "WorkAuthorizationID": 2,
//     "WAPrefix": null,   X
//     "WorkOrderID_Old": "BP-0001", X
//     "ProjectID": null, X
//     "DO_Number": null, X
//     "StatusID": null, X
//     "ImplementationGroup": "Markings", X
//     "Status": null, X
//     "Description": "Remove confusing signs at 4th and Comal", X
//     "TaskOrder": null,
//     "Priority": null, X (DROP)
//     "DependenciesAndNotes": null, (DROP)
//     "InitiationStatus": null, (DROP)
//     "FieldEngineerEstimate": null, DROP
//     "ActualCost": null, DROP
//     "FieldEngineer": null,(DROP)
//     "PMContact": null,(DROP)
//     "DateFiled": "2007-10-18 00:00:00",(DROP)
//     "DateComplete": "2007-12-01 00:00:00" (DROP)
//     "ApprovedBy": "Alan Hughes", (DROP)
//     "Contract": null, (DROP)
//     "ResurfacingRelationship ": null, (DROP)

//     "SubmittedBy": "Nathan Wilkes",

function getWorkActivities() {
  const activties = WORK_AUTHS.filter((row) => row.ProjectID)
    // exclude any records with no ProjectID (there are ~100)
    .map((row) => mapRowExpanded(row, fields));
  debugger;
  return activties;
}

exports.getWorkActivities = getWorkActivities;
