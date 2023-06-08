import React from "react";
import Can from "../../auth/Can";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, Icon } from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";

export const AddUserButton = () => (
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
  /> )

export const EditUserButton = ({id}) => (
  <Can
    perform="user:edit"
    yes={
      <RouterLink to={`/moped/staff/edit/${id}`}>
        <EditOutlinedIcon color="primary" />
      </RouterLink>
    }
  />
);
