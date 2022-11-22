import React from "react";
import { useMutation } from "@apollo/client";
import ComponentForm from "./ComponentForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { UPDATE_COMPONENT_ATTRIBUTES } from "src/queries/components";

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
  refetchProjectComponents,
  setClickedComponent,
}) => {
  const classes = useStyles();

  const [updateComponentAttributes] = useMutation(UPDATE_COMPONENT_ATTRIBUTES);

  const onSave = (formData) => {
    const { description, subcomponents } = formData;
    const { project_component_id: projectComponentId } = componentToEdit;

    const subcomponentsArray = subcomponents
      ? subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
          is_deleted: false,
          project_component_id: projectComponentId,
        }))
      : [];

    console.log({ subcomponentsArray });

    updateComponentAttributes({
      variables: {
        projectComponentId: projectComponentId,
        description,
        subcomponents: subcomponentsArray,
      },
    }).then(() => {
      // Update component list item and clicked component state
      refetchProjectComponents();
      setClickedComponent((prevComponent) => ({
        ...prevComponent,
        description,
        moped_proj_components_subcomponents: subcomponentsArray,
      }));
    });
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
    onClose();
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
