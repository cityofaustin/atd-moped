import React, { useState } from "react";
import { Typography, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import ProjectComments from "./../projects/projectView/ProjectComments"

const DashboardEditModal = ({ project, displayText }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log(project);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  console.log(displayText);
  return (
    <>
      <Typography onClick={() => setIsDialogOpen(true)}>
        {displayText.length > 0 ? displayText : `-`}
      </Typography>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle>{project.project_name}</DialogTitle>
        <DialogContent>
          <ProjectComments modal projectId={project.project_id}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardEditModal;
