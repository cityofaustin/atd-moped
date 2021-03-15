import React from "react";
import ProjectTeamTable from "../projectView/ProjectTeamTable";
import { Box } from "@material-ui/core";

const NewProjectTeam = ({ personnel, setPersonnel }) => {
  return (
    <Box style={{ padding: 25 }}>
      <ProjectTeamTable
        personnelState={personnel}
        setPersonnelState={setPersonnel}
      />
    </Box>
  );
};

export default NewProjectTeam;
