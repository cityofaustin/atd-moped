import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeText = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;

  const changeData = change.record_data.event.data;

  // project creation
  if (change.description.length === 0) {
    // created project as (bold project name)
    changeText = `${changeData.new.project_name} created`;
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeText, changeIcon };
  }

  // need to use a lookup table
  if (entryMap.fields[change.description[0].field]?.lookup) {
    // adding a new field
    if (
      changeData.old === null ||
      // the entity list used to use 0 as an id for null or empty
      changeData.old === 0 ||
      changeData.old[change.description[0].field] === 0
    ) {
      changeText = `
        Added "${entityList[change.description[0].new]}" as
        ${entryMap.fields[change.description[0].field].label}`;
    }
    // use the lookup table
    changeText = `Changed ${
      entryMap.fields[change.description[0].field].label
    } to "${entityList[changeData.new[change.description[0].field]]}"`;
  } else {
    changeText = `
          Changed ${entryMap.fields[change.description[0].field].label}
          to "${changeData.new[change.description[0].field]}"`;
    // have this check if "" and show (blank) instead
  }

  return { changeText, changeIcon };
};
