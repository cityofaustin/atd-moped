import React, { useState } from "react";
import { INITIAL_MUTATION } from "../../queries/placeholder";

import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import { gql, useMutation, useQuery } from "@apollo/client";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  editIcon: {
    cursor: "pointer",
    marginLeft: "8px",
    fontSize: "16px",
  },
  editIconConfirm: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "24px",
  },
  fieldGridItem: {
    padding: "1rem",
  },
  fieldGridItemButtons: {
    minWidth: "3rem",
  },
}));

/**
 * Shows data and makes fields editable.
 * @param {object} fieldConfiguration - The configuration to be rendered
 * @param {object} data - The data already gathered
 * @param {boolean} loading - The Apollo loading variable
 * @param {object} error - The Apollo error object
 * @param {function} refetch - The Apollo refetch function
 * @returns {JSX.Element}
 * @constructor
 */
const DataTable = ({ fieldConfiguration, data, loading, error, refetch }) => {
  const classes = useStyles();

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  const LOOKUP_TABLE_QUERY = gql(
    "query RetrieveLookupValues {\n" +
      Object.keys(fieldConfiguration.fields)
        .filter(
          field => (fieldConfiguration.fields[field]?.lookup ?? null) !== null
        )
        .map(field => {
          const {
            table,
            fieldLabel,
            fieldValue,
            relationship,
          } = fieldConfiguration.fields[field]?.lookup;

          const relationshipFilter = !!relationship ? `(${relationship})` : "";

          return `
            ${table} ${relationshipFilter} {
              fieldLabel: ${fieldLabel}
              fieldValue: ${fieldValue}
            }
          `;
        }) +
      "}\n"
  );

  const {
    loading: lookupTablesLoading,
    error: lookupTablesError,
    data: lookupTablesData,
  } = useQuery(LOOKUP_TABLE_QUERY);

  // editValue, value of field being edited
  const [editValue, setEditValue] = useState(null);
  // editField: string, name of field being edited
  const [editField, setEditField] = useState("");
  // isEditing is True if any field is in edit state
  const [isEditing, setIsEditing] = useState(false);
  // errorField, name of field that contains error
  const [errorField, setErrorField] = useState("");
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);

  const [updateField] = useMutation(INITIAL_MUTATION);

  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  /**
   * Generates a mutation GraphQL query object ready to be executed.
   * @param field - The name of the field to be updated
   * @param value - The value to update with
   * @returns {gql}
   */
  const generateUpdateQuery = (field, value) => {
    const tableConfig = fieldConfiguration.table;

    const fieldConfig = fieldConfiguration.fields[field];

    // Remove break characters
    let gqlFormattedValue = String(value)
      .trim()
      .replace(/(\r\n|\n|\r)/gm, "");

    switch (fieldConfig.type) {
      case "number":
      case "boolean":
        gqlFormattedValue = `${gqlFormattedValue}`;
        break;
      default:
        gqlFormattedValue = `"${gqlFormattedValue}"`;
        break;
    }

    // Generate the mutation
    // If you are setting a boolean with a dependent field to false, clear that dependent field
    const mutation = `
      mutation ${tableConfig.update.mutationName} {
        ${tableConfig.update.mutationTable}(
          ${tableConfig.update.where},
          _set: {
            ${field}: ${gqlFormattedValue},
            ${
              !!fieldConfig.dependentField && value === false
                ? `${fieldConfig.dependentField}: null`
                : ""
            }
          }
        ) {
          affected_rows
        }
      }
    `;

    return gql`
      ${mutation}
    `;
  };

  /**
   * Retrieves the label/name for a field
   * @param {string} field - The value of the string
   * @returns {string}
   */
  const getLabel = field => {
    return fieldConfiguration.fields[field]?.label ?? null;
  };

  /**
   * Retrieves the value from the table object in memory
   * @param {string} field - The name of the field (column)
   * @returns {*} - The value or null if field not in table
   */
  const getValue = field => {
    const tableName = fieldConfiguration.table.name;
    return data[tableName].length > 0 && data[tableName][0][field]
      ? data[tableName][0][field]
      : null;
  };

  /**
   * Retrieves the field's value and returns a printable formatted string or JSX
   * Used if field does not have a custom format function
   * @param {string} field - The name of the field (column)
   * @returns {string|JSX}
   */
  const formatValue = field => {
    let formattedValue = getValue(field);

    const fieldConfig = fieldConfiguration.fields[field];

    const fieldType = fieldConfig?.type ?? "string";
    const emptyValue = fieldConfig?.emptyValue ?? "None";

    switch (fieldType) {
      case "date":
        formattedValue = new Date(formattedValue).toLocaleDateString("en-US", {
          timeZone: "UTC",
        });
        break;
      case "boolean":
        formattedValue = formattedValue === true;
        break;
      case "string":
        formattedValue =
          formattedValue === null || formattedValue.trim() === ""
            ? emptyValue
            : formattedValue;
        break;
      default:
        break;
    }
    return formattedValue;
  };

  /**
   * if editValue is not null, executes mutation, triggers Snackbar with mutation response and resets state
   * @param field, optional. Provided when updating boolean field
   * @param value, optional. Provided when updating boolean field
   */
  const executeMutation = (field = null, value = null) => {
    const mutationField = field || editField;
    const mutationValue = value !== null ? value : editValue;
    const nullableField = fieldConfiguration.fields[mutationField].nullable ?? true;
    // Execute mutation only if there is a new value selected, prevents user
    // from attempting to save initial value, which would be null
    // Also prevents from executing migration if value has not changed
    // And checks if field is allowed to be a blank string
    if (mutationValue !== null && (nullableField || mutationValue !== "")) {
      updateField({
        mutation: generateUpdateQuery(mutationField, mutationValue),
      })
        .then(response => {
          setSnackbarState({
            open: true,
            message: (
              <span>
                Success! the field <b>{getLabel(mutationField)}</b> has been
                updated!
              </span>
            ),
            severity: "success",
          });
          refetch();
        })
        .catch(error => {
          console.log(`Error Updating ${mutationField}`, error);
          setSnackbarState({
            open: true,
            message: (
              <span>
                There was a problem updating field{" "}
                <b>{getLabel(mutationField)}</b>.
              </span>
            ),
            severity: "error",
          });
          refetch();
        })
        .finally(() => {
          setEditValue(null);
          setEditField("");
          setIsEditing(false);
          setErrorField("");
          setTimeout(() => setSnackbarState(DEFAULT_SNACKBAR_STATE), 3000);
        });
    } else {
      if (!nullableField && mutationValue === "") {
        setErrorField(mutationField);
      }
    }
  };

  /**
   * Makes the update via GraphQL
   * @param {ChangeEvent} e - HTML Dom Event
   */
  const handleAcceptClick = e => {
    e.preventDefault();
    executeMutation();
  };

  /**
   * Handles closing the edit mode
   * @param {ChangeEvent} e - HTML DOM Event
   */
  const handleCancelClick = e => {
    e.preventDefault();
    setEditValue(null);
    setEditField("");
    setIsEditing(false);
    setErrorField("");
  };

  /**
   * Handles an update to the value of the field.
   * @param value
   */
  const handleFieldValueUpdate = value => {
    if (errorField !== "") {
      setErrorField("")
    }
    setEditValue(value.target.value);
  };

  const handleBooleanValueUpdate = (event, field) => {
    // Prevent user from switching boolean while editing another field
    if (!isEditing) {
      executeMutation(field, event.target.checked);
    }
  };

  /**
   * Render a date component
   * @param {string} field
   * @param {string} initialValue
   */
  const renderDateEdit = (field, initialValue) => {
    const fieldConfig = fieldConfiguration.fields[field];

    return (
      <TextField
        fullWidth
        id="date"
        label={fieldConfig.label}
        type="date"
        defaultValue={editValue ?? initialValue}
        placeholder={fieldConfig?.placeholder}
        className={null}
        onChange={e => handleFieldValueUpdate(e)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  };

  /**
   * Render a string component
   * @param {string} field
   * @param {string} initialValue
   */
  const renderStringEdit = (field, initialValue) => {
    const fieldConfig = fieldConfiguration.fields[field];

    return (
      <TextField
        fullWidth
        id="text"
        label={fieldConfig.label}
        type="text"
        defaultValue={editValue ?? initialValue}
        placeholder={
          errorField === field ? fieldConfig?.errorMessage : fieldConfig?.placeholder
        }
        className={null}
        error={errorField === field}
        multiline={fieldConfig?.multiline ?? false}
        rows={fieldConfig?.multilineRows ?? 1}
        onChange={e => handleFieldValueUpdate(e)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  };

  /**
   * Render a select component
   * @param {string} field
   * @param {string} initialValue
   */
  const renderSelectEdit = (field, initialValue) => {
    const fieldConfig = fieldConfiguration.fields[field];

    // It must have either a lookup, or specific options.
    const lookupTable = fieldConfig?.lookup?.table ?? null;

    const lookupFormat = fieldConfig?.lookup?.format ?? null;

    const lookupValues = lookupTable
      ? lookupTablesData[lookupTable] ?? []
      : fieldConfig?.options ?? [];

    const currentValue = editValue ?? initialValue;

    return (
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel id={`select-${field}`}>{fieldConfig.label}</InputLabel>
        <Select
          fullWidth
          labelId={`select-${field}`}
          id={`select-field-${field}`}
          value={lookupFormat ? lookupFormat(currentValue) : currentValue}
          onChange={e => handleFieldValueUpdate(e)}
          className={fieldConfig?.style ?? null}
        >
          {lookupValues.map(menuItem => {
            return (
              <MenuItem
                fullWidth
                value={String(menuItem.fieldValue).toLowerCase()}
                className={fieldConfig?.lookup?.style ?? null}
              >
                {menuItem.fieldLabel}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  /**
   * Render a boolean component
   * @param {string} field
   * @param {string} initialValue
   */
  const renderBooleanEdit = (field, initialValue) => {
    return (
      <FormControl fullWidth className={classes.formControl}>
        <Switch
          fullWidth
          labelId={"boolean-" + field}
          id={field}
          checked={!isEditing && editValue ? editValue : initialValue}
          color="primary"
          onChange={event => handleBooleanValueUpdate(event, field)}
        ></Switch>
      </FormControl>
    );
  };

  /**
   * Updates state with which field is being edited and sets isEditing to true
   * @param {string} field
   */
  const handleFieldEdit = field => {
    setIsEditing(true);
    setEditField(field);
  };

  return (
    <>
      {(error || lookupTablesError) && (
        <Alert severity="error">
          {error}
          {lookupTablesError}
        </Alert>
      )}
      {loading || lookupTablesLoading ? (
        <CircularProgress />
      ) : (
        <Grid container>
          { // map through fields from field configuration
            Object.keys(fieldConfiguration.fields).map(field => {
            const fieldType =
              fieldConfiguration.fields[field]?.type ?? "string";

            return (
              <Grid
                item
                key={fieldConfiguration.fields[field]?.label}
                className={classes.fieldGridItem}
                xs={12}
                sm={fieldConfiguration.fields[field]?.widthSmallAndLarger ?? 6}
              >
                <Box>
                  {((isEditing && editField !== field) || !isEditing) && (
                    <h4>
                      {fieldConfiguration.fields[field]?.label ?? "Unknown"}
                    </h4>
                  )}
                  {(isEditing && editField === field) ||
                  fieldType === "boolean" ? (
                    // boolean type fields are always rendered using function, regardless of editing status
                    <form onSubmit={e => handleAcceptClick(e)}>
                      <Grid container fullWidth>
                        <Grid item xs={12} sm={9}>
                          {fieldType === "select" && (
                            <>{renderSelectEdit(field, getValue(field))}</>
                          )}
                          {fieldType === "string" && (
                            <>{renderStringEdit(field, getValue(field))}</>
                          )}
                          {fieldType === "date" && (
                            <>{renderDateEdit(field, getValue(field))}</>
                          )}
                          {fieldType === "boolean" && (
                            <>{renderBooleanEdit(field, getValue(field))}</>
                          )}
                        </Grid>
                        {fieldType !== "boolean" && (
                          // show icons to accept or cancel edit
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            className={classes.fieldGridItemButtons}
                          >
                            <Icon
                              className={classes.editIconConfirm}
                              onClick={e => handleAcceptClick(e)}
                            >
                              check
                            </Icon>
                            <Icon
                              className={classes.editIconConfirm}
                              onClick={e => handleCancelClick(e)}
                            >
                              close
                            </Icon>
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  ) : (
                    // if not currently editing field and field is not Boolean
                    <Typography
                      id={"label-" + field}
                      className={
                        fieldConfiguration.fields[field]?.labelStyle ?? null
                      }
                      variant="body1"
                    >
                      {fieldConfiguration.fields[field].format
                        ? fieldConfiguration.fields[field].format(
                            getValue(field)
                          )
                        : formatValue(field)}
                      {fieldConfiguration.fields[field].editable &&
                        !isEditing && (
                          <div>
                            <Icon
                              className={classes.editIcon}
                              onClick={() => handleFieldEdit(field)}
                            >
                              create
                            </Icon>
                          </div>
                        )}
                    </Typography>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarState.open}
        onClose={handleSnackbarClose}
        key={"datatable-snackbar"}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DataTable;
