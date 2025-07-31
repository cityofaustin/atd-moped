import { formatProjectActivity } from "./activityLogFormatters/mopedProjectActivity";
import { formatTagsActivity } from "./activityLogFormatters/mopedTagsActivity";
import { formatFundingActivity } from "./activityLogFormatters/mopedFundingActivity";
import { formatPhasesActivity } from "./activityLogFormatters/mopedPhasesActivity";
import { formatMilestonesActivity } from "./activityLogFormatters/mopedMilestonesActivity";
import { formatPartnersActivity } from "./activityLogFormatters/mopedPartnersActivity";
import { formatPersonnelActivity } from "./activityLogFormatters/mopedPersonnelActivity";
import { formatNotesActivity } from "./activityLogFormatters/mopedNotesActivity";
import { formatComponentsActivity } from "./activityLogFormatters/mopedComponentsActivity";
import { formatProjectTypesActivity } from "./activityLogFormatters/mopedProjectTypesActivity";
import { formatFilesActivity } from "./activityLogFormatters/mopedFilesActivity";
import { formatContractsActivity } from "./activityLogFormatters/mopedContractsActivity";
import { formatMigratedProjectActivity } from "./activityLogFormatters/mopedProjectMigrationActivity";
import { formatMigratedProjectUpdateActivity } from "./activityLogFormatters/mopedProjectUpdateMigrationActivity";

export const formatActivityLogEntry = (change, lookupData, projectId) => {
  const changeText = [{ text: "Project was updated", style: null }];
  const changeIcon = (
    <span className="material-symbols-outlined">summarize</span>
  );

  switch (change.record_type) {
    case "moped_project":
      // if the user is changing the public process status id field,
      // provide the publicProcessStatusList lookup object
      if (change?.description[0]?.fields.includes("public_process_status_id")) {
        return formatProjectActivity(
          change,
          lookupData.publicProcessStatusList
        );
      }
      // otherwise, provide the entityList lookup object
      else {
        return formatProjectActivity(change, lookupData.entityList);
      }
    case "moped_proj_tags":
      return formatTagsActivity(change, lookupData.tagList);
    case "moped_proj_funding":
      return formatFundingActivity(
        change,
        lookupData.fundingSources,
        lookupData.fundingPrograms
      );
    case "moped_proj_phases":
      return formatPhasesActivity(
        change,
        lookupData.phaseList,
        lookupData.subphaseList
      );
    case "moped_proj_milestones":
      return formatMilestonesActivity(change, lookupData.milestoneList);
    case "moped_proj_partners":
      return formatPartnersActivity(change, lookupData.entityList);
    case "moped_proj_personnel":
      return formatPersonnelActivity(change, lookupData.userList);
    case "moped_proj_notes":
      return formatNotesActivity(change);
    case "moped_proj_components":
      return formatComponentsActivity(
        change,
        lookupData.componentList,
        lookupData.phaseList,
        lookupData.subphaseList,
        projectId
      );
    case "moped_project_types":
      return formatProjectTypesActivity(change, lookupData.projectTypeList);
    case "moped_project_files":
      return formatFilesActivity(change);
    case "moped_proj_work_activity":
      return formatContractsActivity(change);
    case "moped_project_migration":
      return formatMigratedProjectActivity(change);
    case "moped_project_update_migration":
      return formatMigratedProjectUpdateActivity(change);
    default:
      return { changeIcon, changeText };
  }
};
