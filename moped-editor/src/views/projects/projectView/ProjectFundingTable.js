import React from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@material-ui/icons";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";

import typography from "../../../theme/typography";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import { TEAM_QUERY, UPSERT_PROJECT_PERSONNEL } from "../../../queries/project";
import { FUNDING_QUERY } from "../../../queries/funding";

import ProjectTeamRoleMultiselect from "./ProjectTeamRoleMultiselect";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { handleKeyEvent } from "../../../utils/materialTableHelpers";

const useStyles = makeStyles(() => ({
  roleChip: {
    margin: ".25rem",
  },
}));

const ProjectFundingTable = ({ projectId = null }) => {
  const isNewProject = projectId === null;
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(FUNDING_QUERY, {
    // sending a null projectId will cause a graphql error
    // id 0 used when creating a new project, no project personnel will be returned
    variables: {
      projectId: projectId ?? 0,
    },
    fetchPolicy: "no-cache",
  });

  if (loading || !data) return <CircularProgress />;

  console.log(data);

  // Get data from the FUNDING_QUERY payload
  let fundingSources = {};

  // For each funding entry...
  data.moped_proj_funding.map(item => {
    console.log(item);
  });

  /**
   * Get lookup value for a given table using a row ID and returning a name
   * @param {string} lookupTable - Name of lookup table as found within the GQL data query object
   * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
   * @param {number} id - ID used to find target row in lookup table
   * @return {string} - Name of attribute in the given row.
   */
  const getLookupValueByID = (lookupTable, attribute, id) => {
    return data[lookupTable].find(item => item[`${attribute}_id`] === id)[
      `${attribute}_name`
    ];
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Source",
      field: "funding_source_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_sources",
          "funding_source",
          row.funding_source_id
        ),
    },
    {
      title: "Program",
      field: "funding_program_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_programs",
          "funding_program",
          row.funding_source_id
        ),
    },
    {
      title: "Description",
      field: "funding_description",
    },
    {
      title: "Status",
      field: "funding_status_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_status",
          "funding_status",
          row.funding_source_id
        ),
    },
    {
      title: "FDU",
      field: "fund_dept_unit",
    },
    {
      title: "Amount",
      field: "funding_amount",
      render: row => {
        return row.funding_amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        // components={}
        data={data.moped_proj_funding}
        title={
          <Typography variant="h2" color="primary">
            Funding sources
          </Typography>
        }
        options={{
          ...(data.moped_proj_funding.length < PAGING_DEFAULT_COUNT + 1 && {
            paging: false,
          }),
          search: false,
          rowStyle: {
            fontFamily: typography.fontFamily,
          },
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: (
              <Typography variant="body1">
                No funding sources to display
              </Typography>
            ),
          },
        }}
        icons={{
          Delete: DeleteOutlineIcon,
        }}
        // editable={}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
