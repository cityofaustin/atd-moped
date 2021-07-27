import React from "react";
import Can from "../../../auth/Can";
import { Button, Icon } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

export const CanAddProjectButton = () => (
  <Can
    perform="newProjects:visit"
    yes={
      <Button
        color="primary"
        variant="contained"
        component={RouterLink}
        to={"/moped/projects/new"}
        startIcon={<Icon>add_circle</Icon>}
      >
        {"New project"}
      </Button>
    }
  />
);
