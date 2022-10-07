import React from "react";
import Can from "../../auth/Can";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { Button, Icon } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

export const newItemButton = (
  <Can
    perform="user:create"
    yes={
      <Button
        color="primary"
        variant="contained"
        component={RouterLink}
        to={"/moped/staff/new"}
        startIcon={<Icon>add_circle</Icon>}
      >
        Add Staff
      </Button>
    }
  />
);

export const editItemButton = (id) => (
  <Can
    perform="user:edit"
    yes={
      <RouterLink to={`/moped/staff/edit/${id}`}>
        <EditOutlinedIcon color="primary" />
      </RouterLink>
    }
  />
);
