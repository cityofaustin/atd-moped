const { DUPE_PROJECTS, DUPE_COMPONENTS } = require("./mappings/dupe_projects");

const PROJECT_FIELDS_TO_COALESCE = [
  "project_website",
  "project_lead_id",
  "date_added",
  "public_process_status_id",
  "interim_project_id",
  "ecapris_subproject_id",
];

const COMPONENT_FIELDS_TO_COALESCE = [
  "description",
  "phase_id",
  "subphase_id",
  "srts_id",
  "location_description",
  "completion_date",
  "interim_project_component_id",
];

const deDupeProjs = (projects, existingProjects, existingComponents) => {
  const nonDupeProjects = [];
  const dupeProjects = [];
  // collect project updates here
  const allProjectUpdates = [];
  // collect component update here
  const allComponentUpdates = [];

  projects.forEach((project) => {
    // search list of dupe projects for a matching project
    const project_id = DUPE_PROJECTS.find(
      (dupe) => dupe.interim_project_id === project.interim_project_id
    )?.moped_project_id;

    if (project_id) {
      // matched: this is a dupe project
      // we will merge project data and
      // related records
      project.project_id = project_id;
      dupeProjects.push(project);
      //   DONE: we deal with components later
      return;
    } else {
      nonDupeProjects.push(project);
    }

    // this will hold the new `moped_proj_components` for the project
    // that will be **inserted**.
    // For projects with dupe components, we will push the
    // dupe components to an array of updatemutations to make
    const new_moped_proj_components = [];

    if (project.moped_proj_components?.data) {
      project.moped_proj_components.data.forEach((newComp) => {
        const interimCompId = newComp.interim_project_component_id;
        const matchComp = DUPE_COMPONENTS.find(
          (existingComp) =>
            existingComp.interim_project_component_id === interimCompId
        );

        // no match: migrate component
        if (!matchComp || matchComp.key === "migrate") {
          new_moped_proj_components.push(newComp);
          return;
        }

        // ignore component
        if (matchComp.key === "do_not_migrate") {
          // will be dropped from the project's component array
          return;
        }

        const existingComp = existingComponents.find(
          ({ project_component_id }) =>
            matchComp.project_component_id === project_component_id
        );

        if (!existingComp) {
          throw `Unknown component match defined: this is an error in the dedupe
          spreadsheet!`;
        }

        /**
         * For any component that lands this far down the logic chain...
         * We are merging this component's data into an existing component
         * So we will potentially take these actions:
         * - mutation the moped_proj_component with additional data from iMoped
         * - insert de-duped subcomponents, work types, and dags
         */
        const thisComponentUpdates = {
          moped_proj_components: {
            project_component_id: existingComp.project_component_id,
          },
          // other props will be added 👇
          // moped_proj_component_tags
          // moped_proj_component_work_types
          // moped_proj_components_subcomponents
        };

        /**
         * Update existing component fields fields
         */
        COMPONENT_FIELDS_TO_COALESCE.forEach((field) => {
          if (existingComp[field] === null && newComp[field] !== null) {
            thisComponentUpdates.moped_proj_components[field] = newComp[field];
          }
        });

        /**
         * Component tags
         */
        if (newComp.moped_proj_component_tags?.data) {
          const existingTags = existingComp.moped_proj_component_tags;
          if (existingTags.length === 0) {
            // insert all tags
            thisComponentUpdates.moped_proj_component_tags =
              newComp.moped_proj_component_tags;
          } else {
            // this case does not occur in data :)
          }
        }

        /**
         * Component work types
         */
        if (newComp.moped_proj_component_work_types?.data) {
          const existingWorktypes =
            existingComp.moped_proj_component_work_types;

          if (existingWorktypes.length === 0) {
            // insert all new work types
            thisComponentUpdates.moped_proj_component_work_types =
              newComp.moped_proj_component_work_types.data;
          } else {
            // we have to dedupe incoming vs existing work type
            const existingWorkTypeIds = existingWorktypes.map(
              (w) => w.work_type_id
            );

            /**
             * Deals with questionable data on by ignoring 'modification'
             * work type if our DB has 'new' work type
             *  "Project_FacilityID": 16350 // "ProjectID": 2627,
             */
            const existingWorkTypeIsNew = existingWorkTypeIds.includes(7);

            const workTypesToInsert =
              newComp.moped_proj_component_work_types.data.filter((w) => {
                return (
                  // work type is  unique
                  !existingWorkTypeIds.includes(w.work_type_id) &&
                  // and work type is not mod when existing type is new
                  !(w.work_type_id === 6 && existingWorkTypeIsNew)
                );
              });

            if (workTypesToInsert.length > 0) {
              // we have unique work types to insert
              thisComponentUpdates.moped_proj_component_work_types =
                workTypesToInsert;
              debugger;
            }
          }
        }

        /**
         * Subcomponents
         */
        if (newComp.moped_proj_components_subcomponents?.data) {
          const existingSubcomps =
            existingComp.moped_proj_components_subcomponents;
          if (existingSubcomps.length === 0) {
            // insert all subcomponents
            thisComponentUpdates.moped_proj_components_subcomponents =
              newComp.moped_proj_components_subcomponents.data;
          } else {
            // dedupe subcomponents - not an issue
            throw `not handled case because it doesn't exist`;
          }
        }

        // save component
        // check if there's anything todo?
        allComponentUpdates.push(thisComponentUpdates);
      });
    }

    // save components back to project
    if (new_moped_proj_components.length > 0) {
      project.moped_proj_components.data = new_moped_proj_components;
    } else {
      // all components were dupes
      delete project.moped_proj_components;
    }
  });

  dupeProjects.forEach((newProject) => {
    const thisProjectUpdates = {
      moped_project: {},
      // other props will be added 👇
      //   moped_proj_tags: [],
      //   moped_proj_personnel: [],
      //   moped_proj_milestones: [],
      //   moped_proj_notes: [],
      //   moped_proj_phases: [],
      //   moped_proj_funding: [],
      //   moped_proj_work_activities: [],
    };

    const existingProject = existingProjects.find(
      (p) => p.project_id === newProject.project_id
    );
    if (!existingProject) {
      throw `Couldnt find existing project - this shouldnt happen`;
    }

    thisProjectUpdates.moped_project.project_id = newProject.project_id;

    /**
     * Update moped_project fields
     */
    PROJECT_FIELDS_TO_COALESCE.forEach((field) => {
      if (existingProject[field] === null && newProject[field] !== null) {
        thisProjectUpdates.moped_project[field] = newProject[field];
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
        thisProjectUpdates.moped_project.date_added = newProject.date_added;
      }
    }

    /**
     * Create project tags
     */
    if (newProject.moped_proj_tags) {
      const tagInserts = newProject.moped_proj_tags.data.map((tag) => ({
        ...tag,
        project_id: newProject.project_id,
      }));
      thisProjectUpdates.moped_proj_tags = tagInserts;
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
      thisProjectUpdates.moped_proj_personnel = personInserts;
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
      thisProjectUpdates.moped_proj_milestones = milestoneInserts;
    }

    /**
     * Create project notes
     */
    if (newProject.moped_proj_notes) {
      const noteInserts = newProject.moped_proj_notes.data.map((note) => ({
        ...note,
        project_id: newProject.project_id,
      }));
      thisProjectUpdates.moped_proj_notes = noteInserts;
    }

    if (newProject.moped_proj_phases) {
      const phases = newProject.moped_proj_phases.data.map((phase) => ({
        ...phase,
        project_id: newProject.project_id,
      }));
      thisProjectUpdates.moped_proj_phases = phases;
    }

    /**
     * Project funding
     */
    if (newProject.moped_proj_funding) {
      const funding = newProject.moped_proj_funding.data.map((source) => ({
        ...source,
        project_id: newProject.project_id,
      }));
      thisProjectUpdates.moped_proj_funding = funding;
    }

    /**
     * Work activities?
     */
    if (newProject.moped_proj_work_activities) {
      const activities = newProject.moped_proj_work_activities.data.map(
        (wa) => ({
          ...wa,
          project_id: newProject.project_id,
        })
      );
      thisProjectUpdates.moped_proj_work_activities = activities;
    }

    /**
     * We're going to check for components twice. First, here, within the
     * projects which have been flagged as dupes.
     *
     * And again later we will check component dupes across all projects,
     * regardless of if the project itself has been flagged as dupe.
     *
     * We do this because of the format in which the de-duped project data was
     * provided to us
     */
    if (newProject.moped_proj_components) {
      const componentsToMigrate = newProject.moped_proj_components.data.filter(
        (comp) => {
          const interimCompId = comp.interim_project_component_id;
          const matchComp = DUPE_COMPONENTS.find(
            (existingComp) =>
              existingComp.interim_project_component_id === interimCompId
          );
          // no match: migrate component
          if (!matchComp || matchComp.key === "migrate") return true;
          // ignore component
          if (matchComp.key === "do_not_migrate") {
            return false;
          }
          // merge attributes - none of the projects flagges as dupes have
          // this requirement
          throw `merge attributes???`;
        }
      );
      thisProjectUpdates.moped_proj_components = componentsToMigrate;
    }
    allProjectUpdates.push(thisProjectUpdates);
  });

  debugger;
  throw `DISABLE CURRENT PHASE??`;
  throw `TIME TO RETURN DATA THAT CAAN BE MUTATED!`
};

module.exports = {
  deDupeProjs,
};
