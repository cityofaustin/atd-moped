import React from "react";
import {
  TextField,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  CircularProgress,
} from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";

const DefineProjectForm = ({ projectDetails, setProjectDetails }) => {
  const handleFieldChange = (value, name) => {
    const updatedProjectDetails = { ...projectDetails, [name]: value };

    setProjectDetails(updatedProjectDetails);
  };

  const PHASES_QUERY = gql`
    query Phases {
      moped_phases(order_by: { phase_name: asc }) {
        phase_name
      }
    }
  `;

  const STATUS_QUERY = gql`
    query Status {
      moped_status(order_by: { status_name: asc }) {
        status_name
      }
    }
  `;

  const FISCAL_QUERY = gql`
    query Fiscal {
      moped_city_fiscal_years(order_by: { fiscal_year_value: asc }) {
        fiscal_year_value
      }
    }
  `;

  const { loading: phaseLoading, error: phaseError, data: phases } = useQuery(
    PHASES_QUERY
  );

  const {
    loading: statusLoading,
    error: statusError,
    data: statuses,
  } = useQuery(STATUS_QUERY);

  const { loading: fiscalLoading, error: fiscalError, data: fiscal } = useQuery(
    FISCAL_QUERY
  );

  const priorities = [
    {
      priority_order: 1,
      priority_name: "Low",
    },
    {
      priority_order: 2,
      priority_name: "Medium",
    },
    {
      priority_order: 3,
      priority_name: "High",
    },
  ];

  const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  if (phaseLoading) return <CircularProgress />;
  if (phaseError) return `Error! ${phaseError.message}`;

  if (statusLoading) return <CircularProgress />;
  if (statusError) return `Error! ${statusError.message}`;

  if (fiscalLoading) return <CircularProgress />;
  if (fiscalError) return `Error! ${fiscalError.message}`;

  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={4}>
          <TextField
            label="Project Name"
            name="project_name"
            variant="standard"
            type="text"
            value={projectDetails.project_name}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Project Description"
            name="project_description"
            multiline={true}
            variant="standard"
            type="text"
            value={projectDetails.project_description}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            name="start_date"
            label="Start Date"
            type="date"
            variant="standard"
            value={projectDetails.start_date}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={4}>
          <InputLabel>Fiscal Year</InputLabel>

          <Select
            name="fiscal_year"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.fiscal_year}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {fiscal.moped_city_fiscal_years.map(fiscal => (
              <MenuItem
                key={fiscal.fiscal_year_value}
                value={fiscal.fiscal_year_value}
              >
                {fiscal.fiscal_year_value}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={4}>
          <InputLabel>Current Status</InputLabel>
          <Select
            name="current_status"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.current_status}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {statuses.moped_status.map(status => (
              <MenuItem key={status.status_name} value={status.status_name}>
                {capitalize(status.status_name)}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={4}>
          <InputLabel>Current Phase</InputLabel>

          <Select
            name="current_phase"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.current_phase}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {phases.moped_phases.map(phase => (
              <MenuItem key={phase.phase_name} value={phase.phase_name}>
                {capitalize(phase.phase_name)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={4}>
          <InputLabel>Priority</InputLabel>
          <Select
            name="project_priority"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.project_priority}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {priorities.map(priority => (
              <MenuItem
                key={priority.priority_order}
                value={priority.priority_name}
              >
                {priority.priority_name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <InputLabel>Capital Funding?</InputLabel>
          <Switch
            type="checkbox"
            checked={projectDetails.capitally_funded}
            name="capitally_funded"
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={e => handleFieldChange(e.target.checked, e.target.name)}
          />
        </Grid>
        {projectDetails.capitally_funded && (
          <Grid item xs={4}>
            <TextField
              label="eCapris Id"
              name="eCapris_id"
              variant="standard"
              type="text"
              value={projectDetails.eCapris_id}
              onChange={e => handleFieldChange(e.target.value, e.target.name)}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
