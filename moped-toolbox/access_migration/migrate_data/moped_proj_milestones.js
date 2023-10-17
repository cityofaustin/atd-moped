const { logger } = require("./utils/logger");
const { loadJsonFile } = require("./utils/loader");

const PROJ_DATES_FNAME = "./data/raw/project_dates.json";

const PROJ_DATES = loadJsonFile(PROJ_DATES_FNAME);

const milestoneMap = [
  {
    in: "Actual Resurfacing Date",
    milestone_id: 26,
    dateField: "date_actual",
  },
  {
    in: "Public Meeting",
    milestone_id: 66,
    dateField: "date_actual",
  },
  {
    in: "Public Meeting (Tentative)",
    milestone_id: 65,
    description: "Tentative",
    dateField: "date_estimate",
  },
  {
    in: "Start Project Development",
    milestone_id: 66,
    dateField: "date_estimate",
  },
  {
    in: "Actual Construction Start Date",
    phase_id: 9, // construction
    subphase_id: 7, // above-ground construction
    dateField: "phase_end",
  },
  {
    in: "Actual End Date",
    phase_id: 10, // post-construction
    subphase_id: 24, // substantially complete
    dateField: "phase_start",
  },
  {
    in: "Estimated Construction Start Date",
    phase_id: 9, // construction
    subphase_id: 7, // above-ground
    dateField: "phase_start",
  },
  {
    in: "Estimated End Date",
    phase_id: 10, // post-construction
    subphase_id: 24, // substantially complete
    dateField: "phase_start",
  },
];

function getMilestones() {
  /**
   * Project dates in the access DB will be split into both milestones and phases
   */
  const milestones = [];
  const phases = [];
  PROJ_DATES.forEach((dt) => {
    const name = dt.Milestone;
    const match = milestoneMap.find((m) => m.in === name);
    if (!match) {
      // ignore this date
      return match;
    }
    const dateString = dt.MilestoneDate || null;
    const interim_project_id = dt.ProjectID;

    if (match.milestone_id) {
      const { dateField, milestone_id, description } = match;
      const milestone = {
        [dateField]: dateString,
        milestone_id,
        description,
        interim_project_id,
      };
      milestones.push(milestone);
      return;
    }

    if (match.phase_id) {
      const { dateField, phase_id, subphase_id } = match;
      let phase = {
        [dateField]: dateString,
        phase_id,
        subphase_id,
        interim_project_id,
      };
      // check to see if there is already a phase for this project ID matching this phase id + subphase id
      let existingPhase = phases.find(
        (p) =>
          p.interim_project_id === interim_project_id &&
          p.phase_id === phase_id &&
          p.subphase_id === subphase_id
      );
      if (existingPhase) {
        Object.assign(existingPhase, phase);
      } else {
        phases.push(phase);
      }
      return;
    }
    throw `This is not possible and indicates a field map error`;
  });

  const milestonesIdx = milestones.reduce(
    (index, { interim_project_id, ...milestone }) => {
      index[interim_project_id] ??= [];
      index[interim_project_id].push(milestone);
      return index;
    },
    {}
  );

  const phasesIdx = phases.reduce((index, { interim_project_id, ...phase }) => {
    index[interim_project_id] ??= [];
    index[interim_project_id].push(phase);
    return index;
  }, {});

  return { projMilestones: milestonesIdx, projPhasesFromDates: phasesIdx };
}

exports.getMilestones = getMilestones;
