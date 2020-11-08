import React, {useState} from "react";
// import _ from "lodash";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DefineProjectForm from './DefineProjectForm';
import ProjectTeamTable from './ProjectTeamTable';
import MapProjectGeometry from './MapProjectGeometry';
import { gql, useMutation } from "@apollo/client";
// import { useForm } from "react-hook-form";

export const NewProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [defineProjectState, updateProjectState] = useState({
      fiscalYear: "2021",
      phase: "potential",
      priority: "Low",
      projDesc: null,
      projName: null,
      startDate: "2020-01-01",
      status: "active",
      capitallyFunded: false,
      eCaprisId: null
  });
  const [StaffRows, setStaffRows] = React.useState([{
    id: 1,
    name: {
      name: '',
      workgroup: ''
    },
    role: ''
  }]);

  const getSteps = () => {
    return ["Define Project", "Assign Team", "Map Project"];
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DefineProjectForm
                defineProjectState={defineProjectState}
                updateProjectState={updateProjectState}
                />;
      case 1:
        return <ProjectTeamTable
                StaffRows={StaffRows}
                setStaffRows={setStaffRows}
                />;
      case 2:
        return <MapProjectGeometry/>;
      default:
        return "Unknown step";
    }
  }
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

  const addNewProject = gql `
mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $current_status: String!="", $eCapris_id: String!="", $fiscal_year: String!="", $start_date: date!="", $capitally_funded: Boolean!="", $project_priority: Int!="") {
  insert_moped_project(objects: {project_name: $project_name, project_description: $project_description, current_phase: $current_phase, current_status: $current_status, eCapris_id: $eCapris_id, fiscal_year: $fiscal_year, start_date: $start_date, capitally_funded: $capitally_funded, project_priority: $project_priority  }) {
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
    }
  }
}    
`;

const [addProject] = useMutation(addNewProject); 

const TEAMS_MUTATION = gql`
    mutation Teams ($workgroup: String!="", $role_name: String!="", $first_name: String!="", $last_name: String!="") {
      insert_moped_proj_personnel(objects: {workgroup: $workgroup, role_name: $role_name, first_name: $first_name, last_name: $last_name}) {
        affected_rows
        returning {
          workgroup
          role_name
          first_name
          last_name
        }
      }
    }
  `;

const [addStaff] = useMutation(TEAMS_MUTATION);

const handleSubmit = () => {
  console.log({...StaffRows},{...defineProjectState});
  
// let project_name=data.newProject;
// let project_description=data.ProjDesc;
// let eCapris_id=data.eCaprisId;
// let capitally_funded=data.capitalFunded;
// let start_date=data.date;
// let current_phase=data.Phase;
// let project_priority=data.Priority;
// let current_status=data.Status; 
// let fiscal_year=data.FiscalYear;
// addProject({variables: {project_name, project_description, eCapris_id, project_priority,current_phase, current_status, fiscal_year, capitally_funded, start_date}}); 
// let first_name=data.First;
// let last_name=data.Last;
// let workgroup=data.Group;
// let role_name=data.Role; 
// addStaff({variables: {workgroup, role_name, last_name}});     
  
};

  return (
    <div>
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
            <div>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProject;

