import React from "react";
import ProjectNameForm from "./ProjectNameForm";
import ProjectName from "./ProjectName";

const ProjectNameEditable = (props) => {
  return (
    <>
      {props.isEditing ? (
        <ProjectNameForm {...props} />
      ) : (
        <ProjectName
          projectData={props.projectData}
          setIsEditing={props.setIsEditing}
          projectId={props.projectId}
        />
      )}
    </>
  );
};

export default ProjectNameEditable;
