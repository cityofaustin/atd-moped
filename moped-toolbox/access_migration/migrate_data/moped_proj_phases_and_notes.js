/**
 * These utilities generate `moped_proj_phases` and `moped_proj_notes` records from the
 * "project_statusupdate" table, which manages both of these entities in the Access DB.
 *
 * To determine a project's phases as well as the current phase, we must extract all
 * unique phase occurrences per project and use their timestamps to guess which phase
 * is current.
 */
const { loadJsonFile } = require("./utils/loader");
const { PHASES_MAP } = require("./mappings/phases");
const { USERS_FNAME } = require("./moped_users");
const USERS = loadJsonFile(USERS_FNAME);

const FNAME = "./data/raw/project_statusupdate.json";

/* Given a status update text, find it's corresponding phase data */
const setPhaseId = (statusUpdate) => {
  const phaseIn = statusUpdate.ProjectPhase;
  const mopedPhaseId = PHASES_MAP.find((phase) => phase.in === phaseIn)?.out
    ?.phase_id;
  statusUpdate.phase_id = mopedPhaseId || null;
};

/* Groups status updates by project ID and phase */
const groupByProjectAndPhase = (statusUpdates) =>
  statusUpdates.reduce((grouped, statusUpdate) => {
    const projectId = statusUpdate.ProjectID;
    const phaseId = statusUpdate.phase_id;
    if (!phaseId) {
      // todo: think about how were handling status updates with no mapped phase
      return grouped;
    }
    // create entry phase object if not exists
    grouped[projectId] ??= {};
    // create object which will become moped_proj_phase
    grouped[projectId][phaseId] ??= { phase_id: phaseId, dates: [] };
    grouped[projectId][phaseId].dates.push(statusUpdate.StatusDate);
    return grouped;
  }, {});

const createProjPhases = (groupedStatusUpdates) => {
  let currentPhaseDate = { phase_id: null, date: null };
  const projPhases = Object.keys(groupedStatusUpdates).map((phase_id) => {
    // find the earliest date of all status updates with this phase
    // thats the start date
    const { dates } = groupedStatusUpdates[phase_id];
    const phaseStart = dates.reduce((prev, curr) => {
      return prev < curr ? prev : curr;
    });
    // get the max date, which will use determine current phase
    const maxDate = dates.reduce((prev, curr) => {
      return prev > curr ? prev : curr;
    });
    // update current phase date if needed
    if (!currentPhaseDate.date || currentPhaseDate.date < maxDate) {
      currentPhaseDate = { phase_id, date: maxDate };
    }
    return {
      phase_id,
      phase_start: phaseStart,
      is_current_phase: false,
    };
  });
  // now find the phase that is current
  if (currentPhaseDate.phase_id) {
    const currPhase = projPhases.find(
      (phase) => phase.phase_id === currentPhaseDate.phase_id
    );
    currPhase.is_current_phase = true;
  }
  return projPhases;
};

const getProjNotes = (statusUpdates) =>
  statusUpdates.reduce((index, status) => {
    const projectId = status.ProjectID;
    index[projectId] ??= [];
    let project_note = status.Status || "";
    // per NW, we'll merge followup text into note text
    const followup = status.Followup || "";
    if (followup) {
      project_note = `${project_note} Follow-up: ${followup}`;
    }

    if (!project_note) {
      project_note = "This update was migrated from the legacy database"
    }
    setPhaseId(status);
    const phase_id = status.phase_id;

    const date_created = status.StatusDate;

    const project_note_type = 2;

    // set added by user
    let updatedBy = status.UpdatedBy;
    if (updatedBy === "_Unknown") {
      updatedBy = "Nathan Wilkes";
    }
    const matchedUser = USERS.find(
      (user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase() ===
        updatedBy.toLowerCase()
    );
    if (!matchedUser) {
      console.log("USER NOT FOUND: ", updatedBy);
      debugger;
      throw `User not found`;
    }
    // todo: stop defaulting added_by
    index[projectId].push({
      project_note,
      project_note_type,
      date_created,
      added_by_user_id: matchedUser?.user_id || 1,
      phase_id,
    });
    return index;
  }, {});

function getProjPhasesAndNotes() {
  const statusUpdates = loadJsonFile(FNAME);
  statusUpdates.forEach((statusUpdate) => setPhaseId(statusUpdate));
  const grouped = groupByProjectAndPhase(statusUpdates);
  const projPhases = Object.keys(grouped).reduce((index, projectId) => {
    index[projectId] = createProjPhases(grouped[projectId]);
    return index;
  }, {});
  const projNotes = getProjNotes(statusUpdates);
  return { projPhases, projNotes };
}

exports.getProjPhasesAndNotes = getProjPhasesAndNotes;
