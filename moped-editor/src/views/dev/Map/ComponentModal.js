import React, { useState, useReducer, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
} from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { COMPONENTS } from "./data/components";
import { handleNewComponentFeatureLink } from "./utils";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const componentLabel = ({ component_name, component_subtype }) => {
  return component_subtype
    ? `${component_name} - ${component_subtype}`
    : `${component_name}`;
};

const useComponentOptions = (linkMode) =>
  useMemo(() => {
    const isLineRepresentation = linkMode === "lines";
    const options = COMPONENTS.moped_components
      .filter((comp) => comp.line_representation === isLineRepresentation)
      .map((comp) => ({
        value: comp.component_id,
        label: componentLabel(comp),
        data: comp,
      }));
    // add empty option for default state
    return [...options, { value: "", label: "" }];
  }, [linkMode]);

const fields = [
  {
    key: "type",
    label: "Component Type",
    type: "autocomplete",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
  },
];

// const CustomSelect = ({ key, label, options }) => {
//   return (
//     <Select id={key} labelId="workgroup-label" label="Workgroup">
//       {options.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </Select>
//   );
// };

const randomComponentId = () => Math.floor(Math.random() * 10000000);

const CustomAutocomplete = ({
  fieldKey,
  autoFocus,
  dispatchFormState,
  value,
  fieldLabel,
  linkMode,
}) => {
  const options = useComponentOptions(linkMode);

  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => {
        return option.label || "";
      }}
      value={value}
      onChange={(e, option) => {
        dispatchFormState({ key: fieldKey, value: option, action: "update" });
      }}
      getOptionSelected={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={fieldLabel}
          variant="outlined"
          autoFocus={autoFocus}
        />
      )}
    />
  );
};

const initialFormState = fields.reduce((prev, curr) => {
  prev[curr.key] = "";
  return prev;
}, {});

function formStateReducer(state, { key, value, action }) {
  if (action === "update") {
    return { ...state, [key]: value };
  } else {
    return initialFormState;
  }
}

const ComponentModal = ({
  showDialog,
  setShowDialog,
  dispatchComponents,
  setCurrTab,
  selectedFeatures,
  componentFeatures,
  setLinkMode,
  setComponentFeatures,
  setIsLinkingComponents,
  setSelectedFeatures,
  setIsCreatingComponent,
  linkMode,
}) => {
  const classes = useStyles();
  const [formState, dispatchFormState] = useReducer(
    formStateReducer,
    initialFormState
  );

  const onSave = (e) => {
    e.preventDefault();
    const newComponent = {
      ...formState.type.data,
      description: formState.description,
      label: formState.type.label,
      _id: randomComponentId(),
    };

    const newComponentFeatures = handleNewComponentFeatureLink(
      componentFeatures,
      selectedFeatures,
      [newComponent._id]
    );
    // save component
    dispatchComponents({
      action: "add",
      component: newComponent,
    });

    // save componentFeature links
    setComponentFeatures(newComponentFeatures);

    // reset other states
    setSelectedFeatures([]);
    setLinkMode(null);
    setIsLinkingComponents(false);
    setIsCreatingComponent(false);
    dispatchFormState({ action: "reset" });
    // switch to components tab
    setCurrTab(0);
    setShowDialog(false);
  };

  return (
    <Dialog
      open={showDialog}
      onClose={() => {
        setLinkMode(null);
        setIsLinkingComponents(false);
        setIsCreatingComponent(false);
        setSelectedFeatures([]);
        setShowDialog(false);
        dispatchFormState({ action: "reset" });
      }}
      fullWidth
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>New component</h3>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            setShowDialog(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomAutocomplete
                linkMode={linkMode}
                fieldKey={fields[0].key}
                fieldLabel={fields[0].label}
                autoFocus
                dispatchFormState={dispatchFormState}
                value={formState[fields[0].key] || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name={fields[1].key}
                id={fields[1].key}
                label={fields[1].label}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                multiline
                minRows={4}
                value={formState[fields[1].key]}
                onChange={(e) => {
                  dispatchFormState({
                    key: fields[1].key,
                    value: e.target.value,
                    action: "update",
                  });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="demo1"
                id="demo1"
                label="Some other field"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="demo2"
                id="demo2"
                label="Another field"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="demo3"
                id="demo3"
                label="Yet another"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} display="flex" justifyContent="flex-end">
            <Grid item style={{margin: 5}}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircle />}
                onClick={onSave}
              >
                Create component
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentModal;
