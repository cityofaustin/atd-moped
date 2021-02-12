import React from "react";

import DataTable from "../../../components/DataTable/DataTable";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  fieldSelectCapitalize: {
    textTransform: "capitalize",
  },
}));

const ProjectSummaryTable = ({ data, loading, error, refetch }) => {
  const classes = useStyles();

  const projectId = data?.moped_project[0].project_id ?? null;

  const fieldConfiguration = {
    table: {
      name: "moped_project",
      update: {
        mutationName: "updateField",
        mutationTable: "update_moped_project",
        where: `where: {project_id: {_eq: ${projectId}}}`,
      },
    },
    fields: {
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
    },
  };

  return (
    <DataTable
      fieldConfiguration={fieldConfiguration}
      tableName={"moped_project"}
      loading={loading}
      error={error}
      data={data}
      refetch={refetch}
    />
  );
};

export default ProjectSummaryTable;
