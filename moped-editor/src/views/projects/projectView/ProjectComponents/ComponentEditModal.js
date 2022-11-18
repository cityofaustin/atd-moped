import React from "react";
import ComponentForm from "./ComponentForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const ComponentEditModal = ({
  showDialog,
  setShowDialog,
  setIsEditingComponent,
  componentToEdit,
}) => {
  const classes = useStyles();

  const onSave = (formData) => {
    console.log("You saved!");
    // const {
    //   component: {
    //     data: {
    //       component_id,
    //       component_name,
    //       component_subtype,
    //       line_representation,
    //       feature_layer: { internal_table },
    //     },
    //   },
    //   subcomponents,
    //   description,
    // } = formData;

    // const newComponent = {
    //   component_id,
    //   component_name,
    //   component_subtype,
    //   line_representation,
    //   internal_table,
    //   moped_subcomponents: subcomponents,
    //   description,
    //   label: component_name,
    //   features: [],
    // };

    // const linkMode = newComponent.line_representation ? "lines" : "points";

    // setDraftComponent(newComponent);
    // setLinkMode(linkMode);
    // // switch to components tab
    // setShowDialog(false);
  };

  const onClose = () => {
    setIsEditingComponent(false);
    setShowDialog(false);
  };

  const initialFormValues = {
    component: componentToEdit,
    subcomponents: componentToEdit?.moped_proj_components_subcomponents,
    description: componentToEdit?.description,
  };

  //   const initialFormValues = {
  //     component: { value: 7, label: "Bike Lane - Buffered" },
  //     description: "teatsdfdasf",
  //     subcomponents: [{ value: 10, label: "Raised pavement markers" }],
  //   };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Edit component</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ComponentForm
          onSave={onSave}
          formButtonText="Save"
          initialFormValues={initialFormValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ComponentEditModal;
