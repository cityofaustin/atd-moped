const DUPE_PROJECT_IDS = [
  { moped_project_id: 280, interim_project_id: 766 },
  { moped_project_id: 340, interim_project_id: 917 },
  { moped_project_id: 50, interim_project_id: 1216 },
  { moped_project_id: 307, interim_project_id: 1272 },
  { moped_project_id: 279, interim_project_id: 1813 },
  { moped_project_id: 246, interim_project_id: 1978 },
  { moped_project_id: 283, interim_project_id: 2078 },
  { moped_project_id: 233, interim_project_id: 2102 },
  { moped_project_id: 304, interim_project_id: 2378 },
  { moped_project_id: 322, interim_project_id: 2730 },
  { moped_project_id: 341, interim_project_id: 2939 },
  { moped_project_id: 380, interim_project_id: 2973 },
  { moped_project_id: 382, interim_project_id: 2974 },
  { moped_project_id: 278, interim_project_id: 2984 },
  { moped_project_id: 306, interim_project_id: 2990 },
  { moped_project_id: 74, interim_project_id: 2995 },
  { moped_project_id: 228, interim_project_id: 2996 },
  { moped_project_id: 261, interim_project_id: 3025 },
  { moped_project_id: 294, interim_project_id: 3052 },
  { moped_project_id: 240, interim_project_id: 3053 },
  { moped_project_id: 241, interim_project_id: 3054 },
  { moped_project_id: 295, interim_project_id: 3119 },
  { moped_project_id: 367, interim_project_id: 3126 },
  { moped_project_id: 366, interim_project_id: 3164 },
  { moped_project_id: 536, interim_project_id: 3169 },
  { moped_project_id: 342, interim_project_id: 3201 },
  { moped_project_id: 316, interim_project_id: 3216 },
  { moped_project_id: 317, interim_project_id: 3217 },
  { moped_project_id: 315, interim_project_id: 3218 },
];

const PROJECT_FIELDS_TO_COALESCE = [
  "project_website",
  "project_lead_id",
  "date_added",
  "public_process_status_id",
  "interim_project_id",
  "ecapris_subproject_id",
];

const deDupeProjs = (projects, existingProjects) => {
  const nonDupeProjects = [];
  const dupeProjects = [];
  const projUpdates = [];
  projects.forEach((project) => {
    const project_id = DUPE_PROJECT_IDS.find(
      (dupe) => dupe.interim_project_id === project.interim_project_id
    )?.moped_project_id;

    if (project_id) {
      project.project_id = project_id;
      dupeProjects.push(project);
    } else {
      nonDupeProjects.push(project);
    }
  });

  dupeProjects.forEach((newProject) => {
    const existingProject = existingProjects.find(
      (p) => p.project_id === newProject.project_id
    );
    if (!existingProject) {
      throw `Couldnt find existing project - this shouldnt happen`;
    }
    const updates = {
      project_id: newProject.project_id,
    };

    // update select fields if they are null in the existing project
    PROJECT_FIELDS_TO_COALESCE.forEach((field) => {
      if (existingProject[field] === null && newProject[field] !== null) {
        updates[field] = newProject[field];
      }
      if (
        field === "interim_project_id" &&
        existingProject.interim_project_id &&
        existingProject.interim_project_id !== newProject.interim_project_id
      ) {
        throw `this is not right: project cannot already be identified as a different project`;
      }
    });

    // use the interim project's date added if it predates Moped
    if (newProject.date_added) {
      const newDateAdded = new Date(newProject.date_added);
      const oldDateAdded = existingProject.date_added
        ? new Date(existingProject.date_added)
        : null;
      if (!oldDateAdded || newDateAdded < oldDateAdded) {
        updates.date_added = newProject.date_added;
      }
    }
    // if we have updates—push them
    Object.keys(updates).length > 1 && projUpdates.push(updates);
  });

  debugger;
};

module.exports = {
  deDupeProjs,
  DUPE_PROJECT_IDS,
};
