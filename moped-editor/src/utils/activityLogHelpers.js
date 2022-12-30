import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import { ProjectActivityLogTableMaps } from "../views/projects/projectView/ProjectActivityLogTableMaps";

const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeText = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;

  let changeData = {};
  // the legacy way has the change data in event/data.
  // In the new schema, event is undefined
  const legacyVersion = !!change.record_data?.event;

  if (legacyVersion) {
    changeData = change.record_data.event.data;
  } else {
    changeData = change.record_data.data;
  }

  // project creation
  if (change.description.length === 0) {
    changeText = `${changeData.new.project_name} created`;
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeText, changeIcon };
  }

  // need to use a lookup table
  if (entryMap.fields[change.description[0].field]?.lookup) {
    // adding a new field
    if (
      change.description[0].old === null ||
      // the entity list used to use 0 as an id for null or empty
      change.description[0].old === 0 ||
      change.description[0].old[change.description[0].field] === 0
    ) {
      changeText = `
        Added "${entityList[change.description[0].new]}" as
        ${entryMap.fields[change.description[0].field].label}`;
    }

    // updating a field
    if (legacyVersion) {
      changeText = `Changed ${
        entryMap.fields[change.description[0].field].label
      } from "
            ${entityList[change.description[0].old]}
          " to "${entityList[change.description[0].new]}"`;
    } else {
      changeText = `Changed ${
        entryMap.fields[change.description[0].field].label
      } from "${
        entityList[change.description[0].old[change.description[0].field]]
      }
        " to "
        ${entityList[change.description[0].new[change.description[0].field]]}"`;
    }
  } else {
    if (legacyVersion) {
      changeText = `
          Changed ${entryMap.fields[change.description[0].field].label} from "
          ${change.description[0].old}" 
          to "${change.description[0].new}"`;
    } else {
      changeText = `
        Changed ${entryMap.fields[change.description[0].field].label} from "
        ${change.description[0].old[change.description[0].field]}" to 
        "${change.description[0].new[change.description[0].field]}"`;
    }
  }

  return { changeText, changeIcon };
};

const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;
  let changeText = "Project tags updated";

  // Adding a new tag
  if (change.description.length === 0) {
    changeText = `Project tagged with "${
      tagList[change.record_data.data.new.tag_id]
    }" `;
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true) can do
    changeText = `"${
      tagList[change.record_data.data.new.tag_id]
    }" removed from tags`;
  }

  return { changeText, changeIcon };
};

export const formatActivityLogEntry = (change, entityList, tagList) => {
  // console.log(change.record_type);
  const changeText = "text";
  const changeIcon = "icon";

  switch (change.record_type) {
    case "moped_project":
      return formatProjectActivity(change, entityList);
    case "moped_proj_tags":
      return formatTagsActivity(change, tagList);
    default:
      return { changeText, changeIcon };
  }
};
