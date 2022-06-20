import React from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";

import { SUBPROJECT_QUERY, UPDATE_PROJECT_SUBPROJECT, DELETE_PROJECT_SUBPROJECT } from "../../../../queries/subprojects";
import typography from "../../../../theme/typography";

const SubprojectsTable = ({ projectId = null }) => {
  const addActionRef = React.useRef();

  const { loading, error, data, refetch } = useQuery(SUBPROJECT_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  const [updateProjectSubproject] = useMutation(UPDATE_PROJECT_SUBPROJECT);
  const [deleteProjectSubproject] = useMutation(DELETE_PROJECT_SUBPROJECT);

  if (error) console.error(error)
  if (loading || !data) return <CircularProgress />;

  const columns = [
    {
      title: "Project ID",
      field: "project_id",
      editable: "never",
      width: "15%"
    },
    {
      title: "Project name",
      field: "project_name",
      width: "50%",
      validate: entry => !!entry.project_name,
      editComponent: props => (
        <FormControl style={{ width: "100%" }}>
          <Autocomplete
            id="project_name"
            name="project_name"
            options={data.subprojectOptions}
            getOptionLabel={option => option.project_name}
            getOptionSelected={(option, value) => option === value}
            value={props.value}
            onChange={(event, value) => props.onChange(value)}
            renderInput={params => <TextField {...params} />}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
    },
    {
      title: "Current status",
      field: "current_status",
      editable: "never",
      width: "30%",
      render: entry => (
        <ProjectStatusBadge
          status={entry.status_id}
          phase={entry.current_phase}
          projectStatuses={data?.moped_status ?? []}
          condensed/>
      )
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        data={data.subprojects[0]?.moped_projects ?? []}
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
          rowStyle: { fontFamily: typography.fontFamily },
          actionsColumnIndex: -1,
          tableLayout: "fixed",
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
        editable={{
          onRowAdd: newData => {
            const childProjectId = newData?.project_name?.project_id;
              return updateProjectSubproject({
                variables: {
                  parentProjectId: projectId,
                  childProjectId: childProjectId,
                },
                }).then(() => {
                  refetch();
                }).catch(error => console.error(error));
          },
          onRowDelete: newData => {
            const childProjectId = newData?.project_id;
              return deleteProjectSubproject({
                variables: {
                    childProjectId: childProjectId,
                  },
                }).then(() => {
                  refetch();
                }).catch(error => console.error(error));
          }
        }}
      />
    </ApolloErrorHandler>
  );
};

export default SubprojectsTable;
