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
    variables: { projectId: projectId ?? 0 },
    fetchPolicy: "no-cache",
  });

  if (loading || !data) return <CircularProgress />;

  // Get data from the FUNDING_QUERY payload
  let fundingSources = {};

  // For each funding entry...
  data.moped_proj_funding.map(item => {
    console.log(item);
  });

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Source",
      field: "funding_source_id",
    },
    {
      title: "Program",
      field: "funding_program_id",
    },
    {
      title: "Description",
      field: "funding_description",
    },
    {
      title: "Status",
      field: "funding_status_id",
    },
    {
      title: "FDU",
      field: "fund_dept_unit",
    },
    {
      title: "Amount",
      field: "funding_amount",
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
          rowStyle: { fontFamily: typography.fontFamily },
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
        icons={{ Delete: DeleteOutlineIcon }}
        // editable={}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
