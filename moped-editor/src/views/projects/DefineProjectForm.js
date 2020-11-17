import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, InputLabel, MenuItem, Select, Switch, Card, Container, makeStyles } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { DevTool } from '@hookform/devtools';
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const DefineProjectForm = ( props ) => {

  const classes = useStyles();
  // these are the functions we need from RHF
  const { register, getValues, control } = useForm();

  React.useEffect(() => {
    register("capitallyFunded"); // custom register checkbox input
  }, [register])

 
  // for any input, we want to get all values to update the form's state with the stepper component's props
  const handleFormChange = () => {
    props.updateProjectState(getValues());
  };

  const PHASES_QUERY = gql`
    query Phases {
      moped_phases(order_by: {phase_name: asc}) {
        phase_name
      }
    }
  `;

  const STATUS_QUERY = gql`
    query Status {
      moped_status(order_by: {status_name: asc}) {
        status_name
      }
    }
  `;

  const FISCAL_QUERY = gql`
    query Fiscal {
      moped_city_fiscal_years(order_by: {fiscal_year_value: asc}) {
        fiscal_year_value
      }
    }
  `;

  const { loading: phaseLoading, error: phaseError, data: phases} = useQuery(PHASES_QUERY);

  const { loading: statusLoading, error: statusError, data: statuses} = useQuery(STATUS_QUERY);

  const { loading: fiscalLoading, error: fiscalError, data: fiscal} = useQuery(FISCAL_QUERY);

  const priorities = [
    {
      priority_order: 1,
      priority_name: "Low"
    },
    {
      priority_order: 2,
      priority_name: "Medium"
    },
    {
      priority_order: 3,
      priority_name: "High"
    }
  ];

  if (phaseLoading) return 'Loading...';
  if (phaseError) return `Error! ${phaseError.message}`;

  if (statusLoading) return 'Loading...';
  if (statusError) return `Error! ${statusError.message}`;

  if (fiscalLoading) return 'Loading...';
  if (fiscalError) return `Error! ${fiscalError.message}`;

  return (
    <Page className={classes.root} title="Map Project">
      <Container maxWidth={false}>
        <Card>
          <form style={{padding: 25}}>
            <DevTool control={control} />
            <Grid container spacing={3} style={{margin: 20}}>
            <Grid item xs={4}>
              <TextField
                inputRef={register}
                label="Project Name"
                name="projName"
                variant="standard"
                type="text"
                defaultValue={props.defineProjectState.projName}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                inputRef={register}
                label="Project Description"
                name="projDesc"
                multiline={true}
                variant="standard"
                type="text"
                defaultValue={props.defineProjectState.projDesc}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                inputRef={register}
                name="startDate"
                label="Start Date"
                type="date"
                variant="standard"
                defaultValue={props.defineProjectState.startDate}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            </Grid>

            <Grid container spacing={3} style={{margin: 20}}>
            <Grid item  xs={4}>
              <InputLabel>Fiscal Year</InputLabel>
              <Controller
                as={<Select
                  name="fiscalYear"
                  ref={register}
                  style={{ width: 150, paddingLeft: 10 }}>
                  {fiscal.moped_city_fiscal_years.map(fiscal => (
                    <MenuItem
                      key={fiscal.fiscal_year_value}
                      value={fiscal.fiscal_year_value}>
                      {fiscal.fiscal_year_value}
                    </MenuItem>
                  ))}
                </Select>}
                  name="fiscalYear"
                  defaultValue={props.defineProjectState.fiscalYear}
                  control={control}
                  onChange={handleFormChange}
                />
            </Grid>

            <Grid item xs={4}>
              <InputLabel>Current Status</InputLabel>
              <Controller
                as={<Select
                  name="status"
                  ref={register}
                  style={{ width: 150, paddingLeft: 10 }}>
                  {statuses.moped_status.map(status => (
                    <MenuItem key={status.status_name} value={status.status_name}>
                    {status.status_name}
                    </MenuItem>
                  ))}
                </Select>}
                name="status"
                defaultValue={props.defineProjectState.status}
                control={control}
                onChange={handleFormChange}
                />
            </Grid>

            <Grid item xs={4}>
              <InputLabel>Current Phase</InputLabel>
              <Controller
                as={<Select
                name="phase"
                ref={register}
                style={{ width: 150, paddingLeft: 10 }}>
                {phases.moped_phases.map(phase => (
                    <MenuItem
                      key={phase.phase_name}
                      value={phase.phase_name}>
                      {phase.phase_name}
                    </MenuItem>
                ))}
                </Select>}
                name="phase"
                defaultValue={props.defineProjectState.phase}
                control={control}
                onChange={handleFormChange}
              />
            </Grid>
            </Grid>

          <Grid container spacing={3} style={{margin: 20}}>
          <Grid item xs={4}>
              <InputLabel>Priority</InputLabel>
              <Controller
                as={<Select
                  name="priority"
                  ref={register}
                  style={{ width: 150, paddingLeft: 10 }}>
                  {priorities.map(priority => (
                    <MenuItem
                      key={priority.priority_order}
                      value={priority.priority_name}>
                      {priority.priority_name}
                    </MenuItem>
                  ))}
              </Select>}
              name="priority"
              defaultValue={props.defineProjectState.priority}
              control={control}
              onChange={handleFormChange}
              />
            </Grid>
           
            <Grid item xs={4}>
            <InputLabel>Capitally Funded?</InputLabel>
              <Switch
              inputRef={register}
              type="checkbox"
              defaultValue={props.defineProjectState.capitallyFunded}
              name="capitallyFunded"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={handleFormChange}
              /> 
            </Grid>
            {props.defineProjectState.capitallyFunded && (<Grid item xs={4}>
              <TextField
                inputRef={register}
                label="eCapris Id"
                name="eCaprisId"
                variant="standard"
                type="text"
                defaultValue={props.defineProjectState.eCaprisId}
                onChange={handleFormChange}
                />
            </Grid>)}
            </Grid>
          </form>
        </Card>
      </Container>
    </Page>
  );
};

export default DefineProjectForm;