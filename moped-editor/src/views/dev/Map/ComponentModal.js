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

const useComponentOptions = () =>
  useMemo(() => {
    const options = COMPONENTS.moped_components.map((comp) => ({
      value: comp.component_id,
      label: componentLabel(comp),
      data: comp,
    }));
    // add empty option for default state
    return [...options, { value: "", label: "" }];
  }, []);

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
  const options = useComponentOptions();

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
  setDraftComponent,
  setLinkMode,
  setIsEditingComponent,
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
      features: [],
    };

    const linkMode = newComponent.line_representation ? "lines" : "points";

    setDraftComponent(newComponent);
    setLinkMode(linkMode);
    // switch to components tab
    setShowDialog(false);
  };

  const onClose = () => {
    setLinkMode(null);
    setDraftComponent(null);
    setIsEditingComponent(false);
    setShowDialog(false);
    dispatchFormState({ action: "reset" });
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>New component</h3>
        <IconButton onClick={onClose}>
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
            <Grid item style={{ margin: 5 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircle />}
                onClick={onSave}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentModal;
