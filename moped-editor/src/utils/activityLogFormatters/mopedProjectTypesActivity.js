import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";

export const formatProjectTypesActivity = (change, projectTypeList) => {

  const changeIcon = <BeenhereOutlinedIcon />;
  const projectType =
    projectTypeList[change.record_data.event.data.new.project_type_id];
  const displayText = {
    text: projectType,
    style: "boldText",
  };

  // add a new project type
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        displayText,
        { text: " as a project type ", style: null },
      ],
    };
  }

  // delete an existing component
  if (change.description[0].field === "is_deleted") {
    return {
      changeIcon,
      changeText: [
        { text: "Removed ", style: null },
        displayText,
        { text: " as a project type ", style: null },
      ],
    };
  }
};
