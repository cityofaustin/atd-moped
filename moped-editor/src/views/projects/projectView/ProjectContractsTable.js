import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import typography from "../../../theme/typography";

import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { currencyFormatter } from "../../../utils/numberFormatters";
import DollarAmountIntegerField from "./DollarAmountIntegerField";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  CONTRACT_QUERY,
  UPDATE_CONTRACT,
  ADD_CONTRACT,
  DELETE_CONTRACT,
} from "../../../queries/funding";

const DEFAULT_SNACKBAR_STATE = {
  open: false,
  message: null,
  severity: "success",
};

const useStyles = makeStyles((theme) => ({
  addRecordButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
}));

const ProjectContractsTable = () => {
  const classes = useStyles();
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(CONTRACT_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const [addContract] = useMutation(ADD_CONTRACT);
  const [updateContract] = useMutation(UPDATE_CONTRACT);
  const [deleteContract] = useMutation(DELETE_CONTRACT);

  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);

  if (loading || !data) return <CircularProgress />;

  /**
   * Return Snackbar state to default, closed state
   */
  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Contractor",
      field: "contractor",
      width: "20%",
      // we use this custom component in order to autofocus the input
      editComponent: (props) => (
        <TextField
          {...props}
          onChange={(e) => props.onChange(e.target.value)}
          autoFocus
        />
      ),
    },
    {
      title: "Contract #",
      field: "contract_number",
      width: "20%",
    },
    {
      title: "Description",
      field: "description",
      width: "25%",
    },
    {
      title: "Work assignment ID",
      field: "work_assignment_id",
      width: "20%",
    },
    {
      title: "Amount",
      field: "contract_amount",
      render: (row) => currencyFormatter.format(row.contract_amount),
      editComponent: (props) => <DollarAmountIntegerField {...props} />,
      type: "currency",
      width: "15%",
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        components={{
          EditRow: (props) => (
            <MTableEditRow
              {...props}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                  // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                }
              }}
            />
          ),
          Action: (props) => {
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
                  className={classes.addRecordButton}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  onClick={props.action.onClick}
                >
                  Add Contract
                </Button>
              );
            }
          },
        }}
        data={data.moped_proj_contract}
        title={
          <div>
            <Typography
              variant="h2"
              color="primary"
              style={{ paddingTop: "1em" }}
            >
              Contracts
            </Typography>
          </div>
        }
        options={{
          ...(data.moped_proj_contract.length < PAGING_DEFAULT_COUNT + 1 && {
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
              <Typography variant="body1">No contracts to display</Typography>
            ),
          },
        }}
        icons={{
          Delete: DeleteOutlineIcon,
          Edit: EditOutlinedIcon,
        }}
        editable={{
          onRowAdd: (newData) =>
            addContract({
              variables: {
                objects: {
                  ...newData,
                  project_id: projectId,
                },
              },
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem adding the record. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              }),
          onRowUpdate: (newData, oldData) => {
            const updateContractData = newData;

            // Remove unneeded variable
            delete updateContractData.__typename;
            updateContractData.contract_amount = Number(
              newData.contract_amount
            );

            return updateContract({
              variables: updateContractData,
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem updating record. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              });
          },
          onRowDelete: (oldData) =>
            deleteContract({
              variables: {
                id: oldData.id,
              },
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem deleting the reecord. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              }),
        }}
      />
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
    </ApolloErrorHandler>
  );
};

export default ProjectContractsTable;
