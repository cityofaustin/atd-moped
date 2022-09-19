import React, { useState, useReducer, useMemo } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { COMPONENTS } from "./data/components";
import { input } from "aws-amplify";
import { sub } from "date-fns";

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

const componentOptions = COMPONENTS.moped_components.map((comp) => ({
  value: comp.component_id,
  label: componentLabel(comp),
  data: comp,
}));

const fields = [
  {
    key: "type",
    label: "Type",
    type: "autocomplete",
    options: componentOptions,
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

const randomComponentId = () => Math.floor(Math.random() * 10000000000);

const CustomAutocomplete = ({
  fieldKey,
  options,
  autoFocus,
  dispatchFormState,
  value,
  fieldLabel,
}) => {
  const theOptions = useMemo(() => {
    return [...options, { value: "", label: "" }];
  }, [options]);

  return (
    <Autocomplete
      id="combo-box-demo"
      options={theOptions}
      getOptionLabel={(option) => {
        return option.label || "";
      }}
      value={value}
      onChange={(e, option) => {
        dispatchFormState({ key: fieldKey, value: option });
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

function formStateReducer(state, { key, value }) {
  return { ...state, [key]: value };
}

const initialFormState = fields.reduce((prev, curr) => {
  prev[curr.key] = "";
  return prev;
}, {});

const ComponentModal = ({ showDialog, setShowDialog, dispatchComponents }) => {
  const classes = useStyles();
  const [formState, dispatchFormState] = useReducer(
    formStateReducer,
    initialFormState
  );
  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      maxWidth={"lg"}
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
            {fields.map((field, i) => (
              <Grid item xs={12} key={field.key}>
                {field.type === "autocomplete" && (
                  <CustomAutocomplete
                    options={field.options}
                    fieldKey={field.key}
                    fieldLabel={field.label}
                    autoFocus={i === 0}
                    dispatchFormState={dispatchFormState}
                    value={formState[field.key] || ""}
                  />
                )}
                {field.type === "textarea" && (
                  <TextField
                    fullWidth
                    autoFocus={i === 0}
                    size="small"
                    name={field.key}
                    id={field.key}
                    label={field.label}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    multiline
                    minRows={4}
                    value={formState[field.key]}
                    onChange={(e) => {
                      dispatchFormState({
                        key: field.key,
                        value: e.target.value,
                      });
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} display="flex" justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutline />}
                onClick={(e) => {
                  e.preventDefault();
                  dispatchComponents({
                    action: "add",
                    component: {
                      ...formState.type.data,
                      description: formState.description,
                      label: formState.type.label,
                      _id: randomComponentId(),
                    },
                  });
                  setShowDialog(false);
                }}
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
