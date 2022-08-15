import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Snackbar,
  Typography,
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

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  PURCHASE_ORDER_QUERY,
  UPDATE_PURCHASE_ORDER,
  ADD_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER,
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

const ProjectPurchaseOrderTable = () => {
  const classes = useStyles();
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(PURCHASE_ORDER_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const [addPurchaseOrder] = useMutation(ADD_PURCHASE_ORDER);
  const [updatePurchaseOrder] = useMutation(UPDATE_PURCHASE_ORDER);
  const [deletePurchaseOrder] = useMutation(DELETE_PURCHASE_ORDER);

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
      title: "Vendor",
      field: "vendor",
    },
    {
      title: "DO #",
      field: "purchase_order_number",
    },
    {
      title: "Description",
      field: "description",
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
                  Add Purchase order
                </Button>
              );
            }
          },
        }}
        data={data.moped_purchase_order}
        title={
          <div>
            <Typography
              variant="h2"
              color="primary"
              style={{ paddingTop: "1em" }}
            >
              Purchase orders
            </Typography>
          </div>
        }
        options={{
          ...(data.moped_purchase_order.length < PAGING_DEFAULT_COUNT + 1 && {
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
                No purchase orders to display
              </Typography>
            ),
          },
        }}
        icons={{
          Delete: DeleteOutlineIcon,
          Edit: EditOutlinedIcon,
        }}
        editable={{
          onRowAdd: (newData) =>
            addPurchaseOrder({
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
            const updatePurchaseOrderData = newData;

            // Remove unneeded variable
            delete updatePurchaseOrderData.__typename;

            return updatePurchaseOrder({
              variables: updatePurchaseOrderData,
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
            deletePurchaseOrder({
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

export default ProjectPurchaseOrderTable;
