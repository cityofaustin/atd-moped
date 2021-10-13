import React from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@material-ui/icons";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";

import typography from "../../../theme/typography";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
} from "../../../queries/funding";

import { handleKeyEvent } from "../../../utils/materialTableHelpers";

const ProjectFundingTable = ({ projectId = null }) => {
  const addActionRef = React.useRef();

  const { loading, error, data, refetch } = useQuery(FUNDING_QUERY, {
    // sending a null projectId will cause a graphql error
    // id 0 used when creating a new project, no project personnel will be returned
    variables: {
      projectId: projectId ?? 0,
    },
    fetchPolicy: "no-cache",
  });

  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);

  if (loading || !data) return <CircularProgress />;

  console.log(data);

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
   * Lookup object formatted from GraphQL query data response into the
   * shape that <MaterialTable> expects
   * @param {array} arr - array of items from data object {ex: data.moped_fund_sources}
   * @param {key} string - item attribute to return as key ex: "funding_source_id"
   * @param {value} string - item attribute to return as value ex: "funding_source_name"
   * @return {object} - object of key/pair values with lookup item id and name
   */
  const queryArrayToLookupObject = (arr, key, value) => {
    return arr.reduce((obj, item) => {
      obj[item[key]] = item[value];
      return obj;
    }, {});
  };

  const LookupSelectComponent = props => (
    <Select id={props.name} value={props.value}>
      {props.data.map(item => {
        return (
          <MenuItem
            onChange={() => props.onChange(item[`${props.name}_id`])}
            onClick={() => props.onChange(item[`${props.name}_id`])}
            onKeyDown={e => handleKeyEvent(e)}
            value={item[`${props.name}_id`]}
            key={item[`${props.name}_name`]}
          >
            {item[`${props.name}_name`]}
          </MenuItem>
        );
      })}
    </Select>
  );

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
      lookup: queryArrayToLookupObject(
        data.moped_fund_sources,
        "funding_source_id",
        "funding_source_name"
      ),
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_source"}
          data={data.moped_fund_sources}
        />
      ),
    },
    {
      title: "Program",
      field: "funding_program_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_programs",
          "funding_program",
          row.funding_program_id
        ),
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_program"}
          data={data.moped_fund_programs}
        />
      ),
    },
    {
      title: "Description",
      field: "funding_description",
      editComponent: props => (
        <TextField
          id="funding_description"
          name="funding_description"
          multiline
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Status",
      field: "funding_status_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_status",
          "funding_status",
          row.funding_status_id
        ),
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_status"}
          data={data.moped_fund_status}
        />
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
        components={{
          EditRow: props => (
            <MTableEditRow
              {...props}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                  // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                }
              }}
            />
          ),
          Action: props => {
            // Add action icons when for NOT "add"
            if (
              typeof props.action === typeof Function ||
              props.action.tooltip !== "Add"
            ) {
              return <MTableAction {...props} />;
            } else {
              // else add "Add ..." button
              return (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add Funding Source
                </Button>
              );
            }
          },
        }}
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
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // isNewProjectActions[isNewProject].add(newData);
                console.log("onRowDelete", newData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let updateProjectFundingData = newData;

                // Remove unexpected variables
                delete updateProjectFundingData.__typename;
                delete updateProjectFundingData.added_by;
                delete updateProjectFundingData.date_added;

                console.log(
                  `Updating Project Funding Data #${updateProjectFundingData.proj_funding_id}:`,
                  updateProjectFundingData
                );

                updateProjectFunding({ variables: updateProjectFundingData });
                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log("onRowDelete", oldData);
                deleteProjectFunding({
                  variables: { proj_funding_id: oldData.proj_funding_id },
                });

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
        }}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
