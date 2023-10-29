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

// Key: y - Match and transfer attribuites
// n - No match migrate component
// d - disregard component and do not migrate
const DEDUP_COMPONENTS = [
  { key: "d", project_component_id: 114, interim_project_component_id: 17151 },
  { key: "d", project_component_id: 54, interim_project_component_id: 17403 },
  { key: "d", project_component_id: 54, interim_project_component_id: 17179 },
  { key: "d", project_component_id: 59, interim_project_component_id: 17302 },
  { key: "d", project_component_id: 80, interim_project_component_id: 17231 },
  { key: "d", project_component_id: 92, interim_project_component_id: 18396 },
  { key: "d", project_component_id: 100, interim_project_component_id: 17395 },
  { key: "d", project_component_id: 102, interim_project_component_id: 17400 },
  { key: "d", project_component_id: 104, interim_project_component_id: 2239 },
  { key: "d", project_component_id: 107, interim_project_component_id: 2242 },
  { key: "d", project_component_id: 128, interim_project_component_id: 17169 },
  { key: "d", project_component_id: 161, interim_project_component_id: 17220 },
  { key: "d", project_component_id: 190, interim_project_component_id: 2214 },
  { key: "d", project_component_id: 218, interim_project_component_id: 17370 },
  { key: "d", project_component_id: 233, interim_project_component_id: 1583 },
  { key: "d", project_component_id: 236, interim_project_component_id: 17396 },
  { key: "d", project_component_id: 237, interim_project_component_id: 17397 },
  { key: "d", project_component_id: 265, interim_project_component_id: 17255 },
  { key: "d", project_component_id: 266, interim_project_component_id: 17396 },
  { key: "d", project_component_id: 491, interim_project_component_id: 17190 },
  { key: "d", project_component_id: 544, interim_project_component_id: 17250 },
  { key: "d", project_component_id: 518, interim_project_component_id: 2228 },
  { key: "d", project_component_id: 519, interim_project_component_id: 2229 },
  { key: "d", project_component_id: 672, interim_project_component_id: 17290 },
  { key: "d", project_component_id: 672, interim_project_component_id: 17596 },
  { key: "d", project_component_id: 677, interim_project_component_id: 17300 },
  { key: "d", project_component_id: 677, interim_project_component_id: 17595 },
  { key: "n", project_component_id: 476, interim_project_component_id: 16409 },
  { key: "n", project_component_id: 5, interim_project_component_id: 17197 },
  { key: "n", project_component_id: 586, interim_project_component_id: 17185 },
  { key: "n", project_component_id: 608, interim_project_component_id: 17191 },
  { key: "n", project_component_id: 617, interim_project_component_id: 10992 },
  { key: "n", project_component_id: 155, interim_project_component_id: 11978 },
  { key: "n", project_component_id: 416, interim_project_component_id: 17188 },
  { key: "n", project_component_id: 542, interim_project_component_id: 11978 },
  { key: "n", project_component_id: 7, interim_project_component_id: 17171 },
  { key: "n", project_component_id: 42, interim_project_component_id: 2708 },
  { key: "n", project_component_id: 42, interim_project_component_id: 2707 },
  { key: "n", project_component_id: 129, interim_project_component_id: 12314 },
  { key: "n", project_component_id: 238, interim_project_component_id: 13190 },
  { key: "n", project_component_id: 111, interim_project_component_id: 17367 },
  { key: "n", project_component_id: 517, interim_project_component_id: 17164 },
  { key: "n", project_component_id: 514, interim_project_component_id: 17148 },
  { key: "n", project_component_id: 158, interim_project_component_id: 14709 },
  { key: "n", project_component_id: 203, interim_project_component_id: 16409 },
  { key: "n", project_component_id: 35, interim_project_component_id: 15351 },
  { key: "n", project_component_id: 503, interim_project_component_id: 16082 },
  { key: "n", project_component_id: 318, interim_project_component_id: 17171 },
  { key: "n", project_component_id: 569, interim_project_component_id: 17154 },
  { key: "n", project_component_id: 206, interim_project_component_id: 17157 },
  { key: "n", project_component_id: 506, interim_project_component_id: 10577 },
  { key: "n", project_component_id: 233, interim_project_component_id: 2484 },
  { key: "n", project_component_id: 317, interim_project_component_id: 14187 },
  { key: "n", project_component_id: 545, interim_project_component_id: 10787 },
  { key: "n", project_component_id: 413, interim_project_component_id: 17198 },
  { key: "n", project_component_id: 264, interim_project_component_id: 17255 },
  { key: "n", project_component_id: 546, interim_project_component_id: 10783 },
  { key: "n", project_component_id: 547, interim_project_component_id: 10773 },
  { key: "n", project_component_id: 548, interim_project_component_id: 15344 },
  { key: "n", project_component_id: 22, interim_project_component_id: 14773 },
  { key: "n", project_component_id: 151, interim_project_component_id: 15090 },
  { key: "n", project_component_id: 410, interim_project_component_id: 10992 },
  { key: "n", project_component_id: 415, interim_project_component_id: 17142 },
  { key: "n", project_component_id: 603, interim_project_component_id: 17167 },
  { key: "n", project_component_id: 521, interim_project_component_id: 17168 },
  { key: "n", project_component_id: 588, interim_project_component_id: 17145 },
  { key: "n", project_component_id: 19, interim_project_component_id: 17168 },
  { key: "n", project_component_id: 616, interim_project_component_id: 17226 },
  { key: "n", project_component_id: 411, interim_project_component_id: 12917 },
  { key: "n", project_component_id: 412, interim_project_component_id: 17225 },
  { key: "n", project_component_id: 544, interim_project_component_id: 14786 },
  { key: "n", project_component_id: 417, interim_project_component_id: 14346 },
  { key: "n", project_component_id: 420, interim_project_component_id: 14773 },
  { key: "n", project_component_id: 602, interim_project_component_id: 12919 },
  { key: "n", project_component_id: 605, interim_project_component_id: 16561 },
  { key: "n", project_component_id: 29, interim_project_component_id: 17311 },
  { key: "n", project_component_id: 606, interim_project_component_id: 10573 },
  { key: "n", project_component_id: 309, interim_project_component_id: 17222 },
  { key: "n", project_component_id: 149, interim_project_component_id: 2040 },
  { key: "n", project_component_id: 555, interim_project_component_id: 2044 },
  { key: "n", project_component_id: 193, interim_project_component_id: 17313 },
  { key: "n", project_component_id: 294, interim_project_component_id: 17224 },
  { key: "n", project_component_id: 566, interim_project_component_id: 14213 },
  { key: "n", project_component_id: 578, interim_project_component_id: 10573 },
  { key: "n", project_component_id: 581, interim_project_component_id: 10577 },
  { key: "n", project_component_id: 386, interim_project_component_id: 10538 },
  { key: "n", project_component_id: 504, interim_project_component_id: 14007 },
  { key: "n", project_component_id: 629, interim_project_component_id: 12917 },
  { key: "n", project_component_id: 659, interim_project_component_id: 12279 },
  { key: "y", project_component_id: 9, interim_project_component_id: 17221 },
  { key: "y", project_component_id: 589, interim_project_component_id: 17192 },
  { key: "y", project_component_id: 255, interim_project_component_id: 17183 },
  { key: "y", project_component_id: 256, interim_project_component_id: 17183 },
  { key: "y", project_component_id: 250, interim_project_component_id: 17205 },
  { key: "y", project_component_id: 39, interim_project_component_id: 17237 },
  { key: "y", project_component_id: 39, interim_project_component_id: 17370 },
  { key: "y", project_component_id: 42, interim_project_component_id: 17228 },
  { key: "y", project_component_id: 52, interim_project_component_id: 17268 },
  { key: "y", project_component_id: 68, interim_project_component_id: 17262 },
  { key: "y", project_component_id: 70, interim_project_component_id: 17286 },
  { key: "y", project_component_id: 74, interim_project_component_id: 17260 },
  { key: "y", project_component_id: 78, interim_project_component_id: 17294 },
  { key: "y", project_component_id: 90, interim_project_component_id: 17378 },
  { key: "y", project_component_id: 105, interim_project_component_id: 2218 },
  { key: "y", project_component_id: 143, interim_project_component_id: 17287 },
  { key: "y", project_component_id: 177, interim_project_component_id: 17244 },
  { key: "y", project_component_id: 180, interim_project_component_id: 14165 },
  { key: "y", project_component_id: 212, interim_project_component_id: 17365 },
  { key: "y", project_component_id: 213, interim_project_component_id: 10538 },
  { key: "y", project_component_id: 59, interim_project_component_id: 12361 },
  { key: "y", project_component_id: 214, interim_project_component_id: 2243 },
  { key: "y", project_component_id: 215, interim_project_component_id: 17366 },
  { key: "y", project_component_id: 234, interim_project_component_id: 17391 },
  { key: "y", project_component_id: 235, interim_project_component_id: 17392 },
  { key: "y", project_component_id: 240, interim_project_component_id: 17399 },
  { key: "y", project_component_id: 242, interim_project_component_id: 13188 },
  { key: "y", project_component_id: 259, interim_project_component_id: 17393 },
  { key: "y", project_component_id: 260, interim_project_component_id: 17394 },
  { key: "y", project_component_id: 311, interim_project_component_id: 17179 },
  { key: "y", project_component_id: 704, interim_project_component_id: 17294 },
  { key: "y", project_component_id: 43, interim_project_component_id: 17269 },
  { key: "y", project_component_id: 80, interim_project_component_id: 14207 },
  { key: "y", project_component_id: 44, interim_project_component_id: 17236 },
  { key: "y", project_component_id: 47, interim_project_component_id: 17264 },
  { key: "y", project_component_id: 48, interim_project_component_id: 17245 },
  { key: "y", project_component_id: 92, interim_project_component_id: 2519 },
  { key: "y", project_component_id: 49, interim_project_component_id: 17261 },
  { key: "y", project_component_id: 100, interim_project_component_id: 13538 },
  { key: "y", project_component_id: 102, interim_project_component_id: 2262 },
  { key: "y", project_component_id: 104, interim_project_component_id: 13663 },
  { key: "y", project_component_id: 50, interim_project_component_id: 17232 },
  { key: "y", project_component_id: 107, interim_project_component_id: 11366 },
  { key: "y", project_component_id: 51, interim_project_component_id: 17172 },
  { key: "y", project_component_id: 53, interim_project_component_id: 17234 },
  { key: "y", project_component_id: 55, interim_project_component_id: 17209 },
  { key: "y", project_component_id: 56, interim_project_component_id: 17210 },
  { key: "y", project_component_id: 58, interim_project_component_id: 17297 },
  { key: "y", project_component_id: 128, interim_project_component_id: 14917 },
  { key: "y", project_component_id: 61, interim_project_component_id: 17244 },
  { key: "y", project_component_id: 62, interim_project_component_id: 17376 },
  { key: "y", project_component_id: 142, interim_project_component_id: 17273 },
  { key: "y", project_component_id: 64, interim_project_component_id: 17374 },
  { key: "y", project_component_id: 161, interim_project_component_id: 1277 },
  { key: "y", project_component_id: 65, interim_project_component_id: 17242 },
  { key: "y", project_component_id: 66, interim_project_component_id: 17248 },
  { key: "y", project_component_id: 190, interim_project_component_id: 12682 },
  { key: "y", project_component_id: 79, interim_project_component_id: 17155 },
  { key: "y", project_component_id: 91, interim_project_component_id: 12036 },
  { key: "y", project_component_id: 108, interim_project_component_id: 2263 },
  { key: "y", project_component_id: 118, interim_project_component_id: 10538 },
  { key: "y", project_component_id: 119, interim_project_component_id: 17263 },
  { key: "y", project_component_id: 218, interim_project_component_id: 17237 },
  { key: "y", project_component_id: 122, interim_project_component_id: 2212 },
  { key: "y", project_component_id: 141, interim_project_component_id: 1862 },
  { key: "y", project_component_id: 236, interim_project_component_id: 11855 },
  { key: "y", project_component_id: 237, interim_project_component_id: 10796 },
  { key: "y", project_component_id: 191, interim_project_component_id: 2215 },
  { key: "y", project_component_id: 269, interim_project_component_id: 1889 },
  { key: "y", project_component_id: 271, interim_project_component_id: 2261 },
  { key: "y", project_component_id: 284, interim_project_component_id: 1862 },
  { key: "y", project_component_id: 45, interim_project_component_id: 17249 },
  { key: "y", project_component_id: 46, interim_project_component_id: 17253 },
  { key: "y", project_component_id: 266, interim_project_component_id: 11855 },
  { key: "y", project_component_id: 69, interim_project_component_id: 17303 },
  { key: "y", project_component_id: 76, interim_project_component_id: 17279 },
  { key: "y", project_component_id: 276, interim_project_component_id: 11254 },
  { key: "y", project_component_id: 276, interim_project_component_id: 17174 },
  { key: "y", project_component_id: 241, interim_project_component_id: 2257 },
  { key: "y", project_component_id: 562, interim_project_component_id: 17398 },
  { key: "y", project_component_id: 8, interim_project_component_id: 17283 },
  { key: "y", project_component_id: 117, interim_project_component_id: 17267 },
  { key: "y", project_component_id: 25, interim_project_component_id: 17278 },
  { key: "y", project_component_id: 172, interim_project_component_id: 17274 },
  { key: "y", project_component_id: 491, interim_project_component_id: 17173 },
  { key: "y", project_component_id: 18, interim_project_component_id: 17274 },
  { key: "y", project_component_id: 28, interim_project_component_id: 17275 },
  { key: "y", project_component_id: 36, interim_project_component_id: 17284 },
  { key: "y", project_component_id: 225, interim_project_component_id: 17282 },
  { key: "y", project_component_id: 700, interim_project_component_id: 17282 },
  { key: "y", project_component_id: 575, interim_project_component_id: 2218 },
  { key: "y", project_component_id: 32, interim_project_component_id: 17207 },
  { key: "y", project_component_id: 705, interim_project_component_id: 17385 },
  { key: "y", project_component_id: 17, interim_project_component_id: 17186 },
  { key: "y", project_component_id: 751, interim_project_component_id: 17367 },
  { key: "y", project_component_id: 82, interim_project_component_id: 17259 },
  { key: "y", project_component_id: 96, interim_project_component_id: 2221 },
  { key: "y", project_component_id: 643, interim_project_component_id: 17295 },
  { key: "y", project_component_id: 657, interim_project_component_id: 16350 },
  { key: "y", project_component_id: 644, interim_project_component_id: 17299 },
  { key: "y", project_component_id: 645, interim_project_component_id: 17301 },
  { key: "y", project_component_id: 653, interim_project_component_id: 16560 },
  { key: "y", project_component_id: 663, interim_project_component_id: 17293 },
  { key: "y", project_component_id: 664, interim_project_component_id: 17285 },
  { key: "y", project_component_id: 665, interim_project_component_id: 12324 },
  { key: "y", project_component_id: 696, interim_project_component_id: 17154 },
  { key: "y", project_component_id: 667, interim_project_component_id: 17379 },
  { key: "y", project_component_id: 668, interim_project_component_id: 17377 },
  { key: "y", project_component_id: 671, interim_project_component_id: 15887 },
  { key: "y", project_component_id: 675, interim_project_component_id: 2237 },
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
  // collect project updates here
  const projUpdates = {
    moped_project: [],
    moped_proj_tags: [],
    moped_proj_personnel: [],
    moped_proj_milestones: [],
    moped_proj_notes: [],
    moped_proj_phases: [],
    moped_proj_funding: [],
    moped_proj_work_activities: [],
  };

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

    /**
     * Update moped_project fields
     */
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

    /**
     * Conditionally update `date_added` if we have an earlier one
     */
    if (newProject.date_added) {
      const newDateAdded = new Date(newProject.date_added);
      const oldDateAdded = existingProject.date_added
        ? new Date(existingProject.date_added)
        : null;
      if (!oldDateAdded || newDateAdded < oldDateAdded) {
        updates.date_added = newProject.date_added;
      }
    }
    // if we have any project updates, push them
    Object.keys(updates).length > 1 && projUpdates.moped_project.push(updates);

    /**
     * Create project tags
     */
    if (newProject.moped_proj_tags) {
      const tagInserts = newProject.moped_proj_tags.data.map((tag) => ({
        ...tag,
        project_id: newProject.project_id,
      }));
      projUpdates.moped_proj_tags.push(tagInserts);
    }

    /**
     * Create project personnel
     */
    if (newProject.moped_proj_personnel) {
      const personInserts = newProject.moped_proj_personnel.data.map(
        (pers) => ({
          ...pers,
          project_id: newProject.project_id,
        })
      );
      projUpdates.moped_proj_personnel.push(personInserts);
    }

    /**
     * Create project milestones
     */
    if (newProject.moped_proj_milestones) {
      const milestoneInserts = newProject.moped_proj_milestones.data.map(
        (milestone) => ({
          ...milestone,
          project_id: newProject.project_id,
        })
      );
      projUpdates.moped_proj_milestones.push(milestoneInserts);
    }

    /**
     * Create project notes
     */
    if (newProject.moped_proj_notes) {
      const noteInserts = newProject.moped_proj_notes.data.map((note) => ({
        ...note,
        project_id: newProject.project_id,
      }));
      projUpdates.moped_proj_notes.push(noteInserts);
    }

    if (newProject.moped_proj_phases) {
      const phases = newProject.moped_proj_phases.data.map((phase) => ({
        ...phase,
        project_id: newProject.project_id,
      }));
      projUpdates.moped_proj_phases.push(phases);
    }

    /**
     * Project funding
     */
    if (newProject.moped_proj_funding) {
      const funding = newProject.moped_proj_funding.data.map((source) => ({
        ...source,
        project_id: newProject.project_id,
      }));
      projUpdates.moped_proj_funding.push(funding);
    }

    /**
     * Work activities - there currently aren't any on the dupe projs?
     */
    if (newProject.moped_proj_work_activities) {
      const activities = newProject.moped_proj_work_activities.data.map(
        (wa) => ({
          ...wa,
          project_id: newProject.project_id,
        })
      );
      projUpdates.moped_proj_work_activities.push(activities);
      debugger;
    }

    if (newProject.moped_proj_components) {
      const componentsToMigrate = newProject.moped_proj_components.data.filter(
        (comp) => {
          const interimCompId = comp.interim_project_component_id;
          const matchComp = DEDUP_COMPONENTS.find(
            (existingComp) =>
              existingComp.interim_project_component_id === interimCompId
          );
          // no match: migrate component
          if (!matchComp || matchComp.key === "y") return true;
          // ignore component
          if (matchComp.key === "d") {
            return false;
          }
          // merge attributes
          throw `merge attributs`
          debugger;
        }
      );
      throw `save compnents`
      debugger;
    }
  });
  debugger;
  throw `DISABLE CURRENT PHASE??`;
  throw `hmm do we need to do each project update in bulk? there is no way to undo this!`;
};

module.exports = {
  deDupeProjs,
  DUPE_PROJECT_IDS,
};
