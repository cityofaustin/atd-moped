import React from "react";

import { Button, Typography } from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";

import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

const SubprojectsTable = ({ projectId = null }) => {
  const error = "";
  const data = [];

  const addActionRef = React.useRef();

  const columns = [
    {
      title: "Project ID",
      field: "project_id",
    },
    {
      title: "Project name",
      field: "project_name",
    },
    {
      title: "Current status",
      field: "current_status",
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        data={data}
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
            console.log(props)
            // If isn't the add action
            if (
              typeof props.action === typeof Function ||
              props.action.tooltip !== "Add"
            ) {
              return <MTableAction {...props} />;
            } else {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add subproject
                </Button>
              );
            }
          },
        }}
        title={
          <Typography variant="h2" color="primary">
            Subprojects
          </Typography>
        }
        options={{
          paging: false,
          search: false,
          // rowStyle: { fontFamily: typography.fontFamily },
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: (
              <Typography variant="body1">No subprojects to display</Typography>
            ),
          },
        }}
        icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
        editable ={{
          onRowAdd: newData => console.log(newData),
          onRowDelete: oldData => console.log(oldData)
        }}
      />
    </ApolloErrorHandler>
  );
};

export default SubprojectsTable;
