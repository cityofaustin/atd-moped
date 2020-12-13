import React, { useState } from "react";
import toArray from "lodash.toarray";
import forEach from "lodash.foreach";
import {
  Button,
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DefineProjectForm from "./DefineProjectForm";
import ProjectTeamTable from "./ProjectTeamTable";
import MapProjectGeometry from "./MapProjectGeometry";
import Page from "src/components/Page";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const useStyles = makeStyles(theme => ({
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const NewProjectView = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [defineProjectState, updateProjectState] = useState({
    fiscalYear: "",
    phase: "",
    priority: "",
    projDesc: null,
    projName: null,
    startDate: "2021-01-01",
    status: "",
    capitallyFunded: false,
    eCaprisId: null,
  });
  const [StaffRows, setStaffRows] = useState([
    {
      id: 1,
      name: {
        name: "",
        workgroup: "",
      },
      role: "",
      notes: "",
    },
  ]);

  const getSteps = () => {
    return ["Define Project", "Assign Team", "Map Project"];
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <DefineProjectForm
            defineProjectState={defineProjectState}
            updateProjectState={updateProjectState}
          />
        );
      case 1:
        return (
          <ProjectTeamTable StaffRows={StaffRows} setStaffRows={setStaffRows} />
        );
      case 2:
        return <MapProjectGeometry />;
      default:
        return "Unknown step";
    }
  };
  const steps = getSteps();

  const handleNext = () => {
    let canContinue = true;
    switch (activeStep) {
      case 0:
        canContinue = true;
        break;
      case 1:
        canContinue = true;
        break;
      case 2:
        canContinue = handleSubmit();
        break;
      default:
        return "not a valid step";
    }
    if (canContinue) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
      switch (activeStep) {
        case 1:
          break;
        case 2:
          break;
        default:
          return "not a valid step";
      }
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const addNewProject = gql`
    mutation NewProject(
      $project_name: String! = ""
      $project_description: String! = ""
      $current_phase: String! = ""
      $current_status: String! = ""
      $eCapris_id: String! = ""
      $fiscal_year: String! = ""
      $start_date: date = ""
      $capitally_funded: Boolean! = false
      $project_priority: String! = ""
    ) {
      insert_moped_project(
        objects: [
          {
            project_name: $project_name
            project_description: $project_description
            current_phase: $current_phase
            current_status: $current_status
            eCapris_id: $eCapris_id
            fiscal_year: $fiscal_year
            start_date: $start_date
            capitally_funded: $capitally_funded
            project_priority: $project_priority
            moped_proj_phases: {
              data: {
                completion_percentage: 10
                completed: false
                phase_name: $current_phase
              }
            }
            moped_proj_status_history: {
              data: {
                date_added: "2020-01-01"
                milestone_privacy: false
                status_name: $current_status
              }
            }
          }
        ]
      ) {
        affected_rows
        returning {
          project_name
          project_description
          project_priority
          current_phase
          current_status
          eCapris_id
          fiscal_year
          capitally_funded
          start_date
          moped_proj_phases {
            project_id
            phase_name
            completed
          }
          moped_proj_status_history {
            project_id
            status_name
            date_added
          }
        }
      }
    }
  `;

  const [addProject] = useMutation(addNewProject);

  const TEAMS_MUTATION = gql`
    mutation Teams(
      $workgroup: String! = ""
      $role_name: String! = ""
      $first_name: String! = ""
      $last_name: String! = ""
      $notes: String! = ""
    ) {
      insert_moped_proj_personnel(
        objects: {
          workgroup: $workgroup
          role_name: $role_name
          first_name: $first_name
          last_name: $last_name
          notes: $notes
        }
      ) {
        affected_rows
        returning {
          workgroup
          role_name
          first_name
          last_name
          notes
        }
      }
    }
  `;

  const [addStaff] = useMutation(TEAMS_MUTATION);

  const handleSubmit = () => {
    //data from Define Project going to database
    let projData = toArray({ ...defineProjectState });
    let capitally_funded = projData[0];
    let project_name = projData[1];
    let project_description = projData[2];
    let start_date = projData[3];
    let fiscal_year = projData[4];
    let current_phase = projData[5];
    let current_status = projData[6];
    let project_priority = projData[7];
    let eCapris_id = projData[8];
    addProject({
      variables: {
        project_name,
        project_description,
        eCapris_id,
        project_priority,
        current_phase,
        current_status,
        fiscal_year,
        capitally_funded,
        start_date,
      },
    });

    //data from ProjectTeamTable going to database
    let teamData = toArray({ ...StaffRows });
    forEach(teamData, function(value) {
      let name_array = value.name.name;
      let name_split = name_array.split(" ");
      let first_name = name_split[0];
      let last_name = name_split[1];
      let workgroup = value.workgroup;
      let role_name = value.role;
      let notes = value.notes.userInput;
      addStaff({
        variables: { workgroup, role_name, first_name, last_name, notes },
      });
    });
  };

  return (
    <Page title="New Project">
      <Container>
        <Card className={classes.cardWrapper}>
          <Box pt={2} pl={2}>
            <CardHeader title="New Project" />
          </Box>
          <Divider />
          <CardContent>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <>
                    <Typography>Completed</Typography>
                    <Button onClick={handleReset}>Close</Button>
                  </>
                </div>
              ) : (
                <div>
                  {getStepContent(activeStep)}
                  <Divider />
                  <Box pt={2} pl={2} className={classes.buttons}>
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default NewProjectView;
