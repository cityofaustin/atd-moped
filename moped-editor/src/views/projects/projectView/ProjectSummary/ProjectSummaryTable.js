import React from "react";

import DataTable from "../../../../components/DataTable/DataTable";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Box, Grid } from "@material-ui/core";

import ExternalLink from "../../../../components/ExternalLink";

const useStyles = makeStyles(theme => ({
  fieldSelectCapitalize: {
    textTransform: "capitalize",
  },
}));

const ProjectSummaryTable = ({ data, loading, error, refetch }) => {
  const classes = useStyles();

  const projectId = data?.moped_project[0].project_id ?? null;
  const capitallyFunded = data?.moped_project[0].capitally_funded ?? null;

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
        label: "Current status",
        labelStyle: classes.fieldSelectCapitalize,
        type: "select",
        placeholder: "Select status",
        editable: true,
        lookup: {
          table: "moped_status",
          fieldLabel: "status_name",
          fieldValue: "status_name",
          relationship:
            "where: {status_id: {_gt: 0}}, order_by: {status_order: asc}",
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
        widthSmallAndLarger: 12,
        nullable: false,
        errorMessage: "Field cannot be blank",
      },
      start_date: {
        label: "Start date",
        type: "date",
        placeholder: "Select date",
        editable: true,
      },
      capitally_funded: {
        label: "Capital funding",
        type: "boolean",
        placeholder: "Select capitally funded",
        editable: true,
        dependentField: "ecapris_subproject_id",
      },
      ...(capitallyFunded && {
        ecapris_subproject_id: {
          label: "eCAPRIS subproject ID",
          type: "string",
          placeholder: "Enter eCAPRIS subproject ID",
          emptyValue: "None",
          editable: true,
          format: value => (
            <ExternalLink
              text={value}
              url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${value}`}
            />
          ),
        },
      }),
    },
  };

  const fieldConfigurationPhases = {
    table: {
      name: "moped_proj_phases",
    },
    fields: {
      phase_name: {
        label: "Current phase",
        labelStyle: classes.fieldSelectCapitalize,
        type: "string",
        emptyValue: "None",
        editable: false,
        lookup: {
          table: "moped_phases",
          fieldLabel: "phase_name",
          fieldValue: "phase_name",
          relationship:
            "where: {phase_id: {_gt: 0}}, order_by: {phase_order: asc}",
          style: classes.fieldSelectCapitalize,
          format: value => String(value).toLowerCase(),
        },
        style: classes.fieldSelectCapitalize,
      },
    },
  };

  return (
    <Grid>
      <Box mb={2}>
        <DataTable
          fieldConfiguration={fieldConfigurationPhases}
          tableName={"moped_proj_phases"}
          loading={loading}
          error={error}
          data={data}
          refetch={refetch}
        />
      </Box>
      <Box>
        <DataTable
          fieldConfiguration={fieldConfiguration}
          tableName={"moped_project"}
          loading={loading}
          error={error}
          data={data}
          refetch={refetch}
        />
      </Box>
    </Grid>
  );
};

export default ProjectSummaryTable;
