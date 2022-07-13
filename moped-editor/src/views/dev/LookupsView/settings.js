const subPhaseHandler = (subphases) =>
  subphases &&
  subphases.map((subphase) => (
    <div key={subphase.subphase_id}>{subphase.subphase_name}</div>
  ));

export const NAMES = {
  moped_phases: "Moped phases",
  moped_milestones: "Moped milestones",
};

export const COLUMNS = {
  moped_phases: [
    {
      key: "phase_order",
      label: "Phase order",
    },
    {
      key: "phase_id",
      label: "Phase ID",
    },
    {
      key: "phase_name",
      label: "Phase name",
    },
    {
      key: "phase_description",
      label: "Description",
    },
    {
      key: "moped_subphases",
      label: "Subphases",
      handler: subPhaseHandler,
    },
  ],
  moped_milestones: [
    {
      key: "milestone_id",
      label: "Milestone ID",
    },
    {
      key: "milestone_name",
      label: "Milestone name",
    },
    {
      key: "milestone_order",
      label: "Milestone order",
    },
    {
      key: "milestone_description",
      label: "Description",
    },
  ],
  moped_subphases: [
    {
      key: "subphase_name",
      label: "Subphase name",
    },
    {
      key: "subphase_description",
      label: "Description",
    },
  ],
};
