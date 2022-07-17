import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  // Select,
  Snackbar,
  // TextField,
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
  // UPDATE_PROJECT_FUNDING,
  // ADD_PROJECT_FUNDING,
  // DELETE_PROJECT_FUNDING,
  // UPDATE_FUNDING_TASK_ORDERS,
} from "../../../queries/funding";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  syncLinkIcon: {
    fontSize: "1.2rem",
  },
  editIcon: {
    cursor: "pointer",
    margin: "0 .5rem",
    fontSize: "20px",
  },
  editIconFunding: {
    cursor: "pointer",
    margin: "0.5rem",
    fontSize: "1.5rem",
  },
  editIconContainer: {
    minWidth: "8rem",
    marginLeft: "8px",
  },
  editIconConfirm: {
    cursor: "pointer",
    margin: "0.25rem 0",
    fontSize: "24px",
  },
  editIconButton: {
    margin: "8px 0",
    padding: "8px",
  },
  fieldLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
    margin: "8px 0",
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
  },
  fieldLabelTextSpan: {
    borderBottom: "1px dashed",
    borderBottomColor: theme.palette.text.secondary,
  },
  fieldLabelLink: {
    width: "calc(100% - 2rem)",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  fieldBox: {
    maxWidth: "10rem",
  },
  fieldBoxTypography: {
    width: "100%",
  },
  fieldSelectItem: {
    width: "calc(100% - 3rem)",
  },
  fundingButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
  chipContainer: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "2rem 0",
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  chipAddContainer: {
    minWidth: "500px",
  },
  chipAddMultiselect: {
    width: "100%",
  },
  deptAutocomplete: {
    width: "300px",
    fontSize: ".875em",
    "& .MuiAutocomplete-inputRoot": {
      marginBottom: "16px",
    },
    "& .MuiFormLabel-root": {
      color: theme.palette.text.primary,
    },
  },
  fundSelectStyle: {
    width: "8em",
    border: "1px green solid",
  },
}));

const ProjectPurchaseOrderTable = () => {
  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRef = React.useRef();

  const classes = useStyles();

  /** Params Hook
   * @type {integer} projectId
   * */
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(PURCHASE_ORDER_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  console.log(data)
  // const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  // const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  // const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);

  // const [updateProjectTaskOrders] = useMutation(UPDATE_FUNDING_TASK_ORDERS);

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };
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
      title: "Description",
      field: "description",
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
                  className={classes.fundingButton}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
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
          onRowAdd: newData =>  console.log(newData),
          onRowUpdate: (newData, oldData) => console.log(newData, oldData),
          onRowDelete: oldData => console.log(oldData)
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
