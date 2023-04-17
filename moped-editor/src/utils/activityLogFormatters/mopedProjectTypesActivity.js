export const formatProjectTypesActivity = (change, projectTypeList) => {
  const changeIcon = (
    <span className="material-symbols-outlined">summarize</span>
  );
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

  // delete an existing project type
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

  // Fallback text for other updates. Catches old updates before database refactoring. (status_id etc)
  return {
    changeIcon,
    changeText: [{ text: "Updated ", style: null }, displayText],
  };
};
