import React, { useState } from "react";
import { Typography, Dialog, DialogTitle, DialogContent } from "@material-ui/core";

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
        {displayText}
      </Typography>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle>{project.project_name}</DialogTitle>
        <DialogContent>
          hi
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardEditModal;
