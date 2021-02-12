import React, { useEffect, useState } from "react";

import {
  Box,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import { gql, useQuery } from "@apollo/client";

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
  fieldSelectCapitalize: {
    textTransform: "capitalize",
  },
}));

const ProjectSummaryTable = ({ data, loading, error, refetch }) => {
  const classes = useStyles();

  const fieldConfiguration = {
    current_status: {
      label: "Current Status",
      type: "select",
      placeholder: "Select Status",
      editable: true,
      lookup: {
        table: "moped_status",
        fieldLabel: "status_name",
        fieldValue: "status_name",
        style: classes.fieldSelectCapitalize,
        format: value => String(value).toLowerCase(),
      },
      style: classes.fieldSelectCapitalize,
    },
    current_phase: {
      label: "Current Phase",
      placeholder: "Select phase",
      type: "select",
      editable: true,
      lookup: {
        table: "moped_phases",
        fieldLabel: "phase_name",
        fieldValue: "phase_name",
        style: classes.fieldSelectCapitalize,
        format: value => String(value).toLowerCase(),
      },
      style: classes.fieldSelectCapitalize,
    },
    project_description: {
      label: "Description",
      type: "string",
      placeholder: "Enter description",
      editable: true,
      multiline: true,
      multilineRows: 4,
    },
    start_date: {
      label: "Start Date",
      type: "date",
      placeholder: "Select date",
      editable: true,
    },
    fiscal_year: {
      label: "Fiscal Year",
      type: "select",
      placeholder: "Select fiscal year",
      lookup: {
        table: "moped_city_fiscal_years",
        fieldLabel: "fiscal_year_value",
        fieldValue: "fiscal_year_value",
      },
      editable: true,
    },
    capitally_funded: {
      label: "Capital Funding",
      type: "boolean",
      placeholder: "Select capitally funded",
      editable: true,
    },
    ecapris_id: {
      label: "eCapris ID",
      type: "string",
      placeholder: "Enter eCapris ID",
      emptyValue: "None",
      editable: true,
    },
  };

  const LOOKUP_TABLE_QUERY = gql(
    "query RetrieveLookupValues {\n" +
      Object.keys(fieldConfiguration)
        .filter(field => (fieldConfiguration[field]?.lookup ?? null) !== null)
        .map(field => {
          const {
            table,
            fieldLabel,
            fieldValue,
            relationship,
          } = fieldConfiguration[field]?.lookup;

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

  const [editValue, setEditValue] = useState(null);
  const [editField, setEditField] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Retrieves the value for a field
   * @param {string} field - The value of the string
   * @returns {string}
   */
  const getLabel = field => {
    return fieldConfiguration[field]?.label ?? null;
  };

  /**
   * Retrieves the value from the moped_project object in memory
   * @param {string} field - The name of the field (column)
   * @returns {*} - The value
   */
  const getValue = field => {
    return data.moped_project[0][field] ?? null;
  };

  /**
   * Retrieves the format value and returns a printable formatted string or JSX
   * @param {string} field - The name of the field (column)
   * @param {boolean} raw - Retrieve the value only
   * @returns {string|JSX}
   */
  const formatValue = field => {
    let formattedValue = getValue(field);

    const fieldConfig = fieldConfiguration[field];

    const fieldType = fieldConfig?.type ?? "string";
    const emptyValue = fieldConfig?.emptyValue ?? "None";

    switch (fieldType) {
      case "date":
        formattedValue = new Date(formattedValue).toLocaleDateString();
        break;
      case "boolean":
        formattedValue = formattedValue === true ? "Yes" : "No";
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
   * Makes the update via GraphQL
   * @param {ChangeEvent} e - HTML Dom Event
   */
  const handleAcceptClick = () => {
    console.log("Committing: ");
    console.log("Field: ", editField);
    console.log("value: ", editValue);
    setEditField("");
  };

  /**
   * Handles closing the edit mode
   * @param {ChangeEvent} e - HTML DOM Event
   */
  const handleCancelClick = e => {
    e.preventDefault();
    setEditField("");
  };

  /**
   * Handles the opening of the edit mode.
   * @param {ChangeEvent} e - HTML DOM Event
   */
  const handleFieldUpdate = e => {
    e.preventDefault();
    setEditField("");
    setIsEditing(true);
  };

  /**
   * Whenever the edit field is modified, it checks if it is empty.
   * If so, we are not editing any more. This is not ideal, needs change.
   */
  useEffect(() => {
    setIsEditing(editField !== "");
  }, [editField]);

  useEffect(() => {
    if (!isEditing) setEditValue(null);
  }, [isEditing]);

  /**
   * Handles an update to the value of the field.
   * @param field
   * @param value
   */
  const handleFieldValueUpdate = (field, value) => {
    const newValue = value.target.value;
    console.log("Field: ", field);
    console.log("value: ", newValue);
    setEditValue(newValue);
  };

  /**
   * Render a date component
   * @param {string} field
   * @param {string} initialValue
   * @param {string} label
   * @param {string} placeholder
   */
  const renderDateEdit = (field, initialValue) => {
    const fieldConfig = fieldConfiguration[field];

    return (
      <TextField
        fullWidth
        id="date"
        label={fieldConfig.label}
        type="date"
        defaultValue={editValue ?? initialValue}
        placeholder={fieldConfig?.placeholder}
        className={null}
        onChange={e => handleFieldValueUpdate(field, e)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  };

  /**
   * Render a date component
   * @param {string} field
   * @param {string} initialValue
   */
  const renderStringEdit = (field, initialValue) => {
    const fieldConfig = fieldConfiguration[field];

    return (
      <TextField
        fullWidth
        id="date"
        label={fieldConfig.label}
        type="text"
        defaultValue={editValue ?? initialValue}
        placeholder={fieldConfig?.placeholder}
        className={null}
        multiline={fieldConfig?.multiline ?? false}
        rows={fieldConfig?.multilineRows ?? 1}
        onChange={e => handleFieldValueUpdate(field, e)}
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
    const fieldConfig = fieldConfiguration[field];

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
          onChange={e => handleFieldValueUpdate(field, e)}
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
   * Render a date component
   * @param {string} field
   * @param {string} initialValue
   * @param {string} label
   * @param {string} placeholder
   */
  const renderBooleanEdit = (field, initialValue, label) => {
    return (
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel id={"select-" + field}>{label}</InputLabel>
        <Select
          fullWidth
          labelId={"select-" + field}
          id={field}
          value={editValue ?? initialValue}
          onChange={e => handleFieldValueUpdate(field, e)}
        >
          <MenuItem value={true} selected={editValue === true}>
            Yes
          </MenuItem>
          <MenuItem value={false} selected={editValue === false}>
            No
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <Grid item xs={12} md={6}>
      <Paper>
        <Grid container>
          {Object.keys(fieldConfiguration).map(field => {
            const fieldType = fieldConfiguration[field]?.type ?? "string";
            // const selectOptions = projectDetails[fieldType];

            return (
              <Grid
                item
                key={fieldConfiguration[field]?.label}
                className={classes.fieldGridItem}
                xs={12}
                sm={6}
              >
                <Box mb={2}>
                  {((isEditing && editField !== field) || !isEditing) && (
                    <h4>{fieldConfiguration[field]?.label ?? "Unknown"}</h4>
                  )}
                  {isEditing && editField === field ? (
                    <form onSubmit={e => handleFieldUpdate(e)}>
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
                            <>
                              {renderBooleanEdit(
                                field,
                                getValue(field),
                                getLabel(field)
                              )}
                            </>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          className={classes.fieldGridItemButtons}
                        >
                          <Icon
                            className={classes.editIconConfirm}
                            onClick={handleAcceptClick}
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
                      </Grid>
                    </form>
                  ) : (
                    <InputLabel id={"label-" + field}>
                      {formatValue(field)}
                      {fieldConfiguration[field].editable && !isEditing && (
                        <Icon
                          className={classes.editIcon}
                          onClick={() => setEditField(field)}
                        >
                          create
                        </Icon>
                      )}
                    </InputLabel>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ProjectSummaryTable;
