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
import MaterialTable, { MTableAction } from "@material-table/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";
import RenderFieldLink from "../../../projects/signalProjectTable/RenderFieldLink";

import {
  SUBPROJECT_QUERY,
  UPDATE_PROJECT_SUBPROJECT,
  DELETE_PROJECT_SUBPROJECT,
} from "../../../../queries/subprojects";
import typography from "../../../../theme/typography";

const SubprojectsTable = ({ projectId = null }) => {
  const addActionRef = React.useRef();

  const { loading, error, data, refetch } = useQuery(SUBPROJECT_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  const [updateProjectSubproject] = useMutation(UPDATE_PROJECT_SUBPROJECT);
  const [deleteProjectSubproject] = useMutation(DELETE_PROJECT_SUBPROJECT);

  if (error) console.error(error);
  if (loading || !data) return <CircularProgress />;

  const columns = [
    {
      title: "ID",
      field: "project_id",
      editable: "never",
      width: "15%",
    },
    {
      title: "Name",
      field: "project_name",
      width: "45%",
      validate: (entry) => !!entry.project_name,
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_name}
        />
      ),
      editComponent: (props) => (
        <FormControl style={{ width: "100%" }}>
          <Autocomplete
            id="project_name"
            name="project_name"
            options={data.subprojectOptions}
            getOptionLabel={(option) =>
              `${option.project_id} - ${option.project_name}`
            }
            value={props.value || null}
            onChange={(event, value) => props.onChange(value)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
    },
    {
      title: "Status",
      field: "status",
      editable: "never",
      width: "30%",
      customSort: (a, b) =>
        a.moped_proj_phases?.[0]?.moped_phase?.phase_name <
        b.moped_proj_phases?.[0]?.moped_phase?.phase_name
          ? -1
          : 1,
      render: (entry) => (
        <ProjectStatusBadge
          phaseName={entry.moped_proj_phases?.[0]?.moped_phase?.phase_name}
          phaseKey={entry.moped_proj_phases?.[0]?.moped_phase?.phase_key}
          condensed
        />
      ),
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        data={data.subprojects ?? []}
        columns={columns}
        style={{ padding: "8px" }}
        components={{
          // Note: in our other instances of Material Table, we bypass submitting the form on enter
          // In this table, since we currently only have one field to select, enter will submit the form
          Action: (props) => {
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
            editRow: {
              deleteText: "Are you sure you want to remove this subproject?",
            },
          },
        }}
        icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
        editable={{
          onRowAdd: (newData) => {
            const childProjectId = newData?.project_name?.project_id;
            return updateProjectSubproject({
              variables: {
                parentProjectId: projectId,
                childProjectId: childProjectId,
              },
            })
              .then(() => {
                refetch();
              })
              .catch((error) => console.error(error));
          },
          onRowDelete: (newData) => {
            const childProjectId = newData?.project_id;
            return deleteProjectSubproject({
              variables: {
                childProjectId: childProjectId,
              },
            })
              .then(() => {
                refetch();
              })
              .catch((error) => console.error(error));
          },
        }}
      />
    </ApolloErrorHandler>
  );
};

export default SubprojectsTable;
