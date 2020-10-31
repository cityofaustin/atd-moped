import React from 'react';
import { useForm, useStep } from 'react-hooks-helper';
import BillingAddressForm from './BillingAddressForm';
import ShippingAddressForm from './ShippingAddressForm';
import ShippingMethodForm from './ShippingMethodForm';
import ReviewForm from './ReviewForm';
import ConfirmationForm from './ConfirmationForm';
import "./styles.css";
const steps = [
  { id: 'billing-address' },
  { id: 'shipping-address' },
  { id: 'shipping-method' },
  { id: 'review' },
  { id: 'confirmation' },
];

const defaultData = {
  project_name: '',
  current_phase: '',
  billingAddress: '200 South Main St',
  billingCity: 'Anytown',
  billingState: 'CA',
  billingZip: '90505',
  shippingSameAsBilling: false,
  shippingFirstName: 'John',
  shippingLastName: 'Smith',
  shippingAddress: '100 North Road Rd',
  shippingCity: 'Othertown',
  shippingState: 'NY',
  shippingZip: '10101',
  shippingMethod: 'FREE',
};

const DefineProject = ({ images }) => {
  const [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({ initialStep: 0, steps });
  const { id } = step;

  const props = { formData, setForm, navigation };

  switch (id) {
    case 'billing-address':
      return <BillingAddressForm {...props} />;
    case 'shipping-address':
      return <ShippingAddressForm {...props} />;
    case 'shipping-method':
      return <ShippingMethodForm {...props} />;
    case 'review':
      return <ReviewForm {...props} />;
    case 'confirmation':
      return <ConfirmationForm {...props} />;
    default:
      return null;
  }
};

export default DefineProject;



// import React from "react";
// import { useFormContext } from "react-hook-form";
// import _ from "lodash";
// import Stepper from "@material-ui/core/Stepper";
// import Step from "@material-ui/core/Step";
// import StepLabel from "@material-ui/core/StepLabel";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import NewProjectForm from './NewProjectForm';
// import ProjectTeamTable from './ProjectTeamTable';
// import MapProjectGeometry from './MapProjectGeometry';
// import { gql, useMutation } from "@apollo/client";
// import { Breadcrumb } from "matx"; 

// function getSteps() {
//   return ["One", "Two", "Three"];
// }

// function getStepContent(step, formContent) {
//   switch (step) {
//     case 0:
//       return <NewProjectForm {...{ formContent }} />;
//     case 1:
//       return <ProjectTeamTable {...{ formContent }} />;
//     case 2:
//       return <MapProjectGeometry {...{ formContent }} />;
//     default:
//       return "Unknown step";
//   }
// }

// export const DefineProject = () => {
//   const { watch, errors } = useFormContext();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [compiledForm, setCompiledForm] = React.useState({});
//   const steps = getSteps();
//   const form = watch();

//   const handleNext = () => {
//     let canContinue = true;

//     switch (activeStep) {
//       case 0:
//         setCompiledForm({ ...compiledForm, one: form });
//         canContinue = true;
//         break;
//       case 1:
//         setCompiledForm({ ...compiledForm, two: form });
//         canContinue = true;
//         break;
//       case 2:
//         setCompiledForm({ ...compiledForm, three: form });
//         canContinue = handleSubmit({ ...compiledForm, three: form });
//         break;
//       default:
//         return "not a valid step";
//     }
//     if (canContinue) {
//       setActiveStep(prevActiveStep => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep(prevActiveStep => prevActiveStep - 1);
//       switch (activeStep) {
//         case 1:
//           setCompiledForm({ ...compiledForm, two: form });
//           break;
//         case 2:
//           setCompiledForm({ ...compiledForm, three: form });
//           break;
//         default:
//           return "not a valid step";
//       }
//     }
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//     setCompiledForm({});
//   };

//   const addNewProject = gql `
// mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $current_status: String!="", $eCapris_id: String!="", $fiscal_year: String!="", $start_date: date!="", $capitally_funded: Boolean!="", $project_priority: Int!="") {
//   insert_moped_project(objects: {project_name: $project_name, project_description: $project_description, current_phase: $current_phase, current_status: $current_status, eCapris_id: $eCapris_id, fiscal_year: $fiscal_year, start_date: $start_date, capitally_funded: $capitally_funded, project_priority: $project_priority  }) {
//     affected_rows
//     returning {
//       project_name
//       project_description
//       project_priority
//       current_phase
//       current_status
//       eCapris_id
//       fiscal_year
//       capitally_funded
//       start_date
//     }
//   }
// }    
// `;
//   const [addProject] = useMutation(addNewProject); 

//   const TEAMS_MUTATION = gql`
//   mutation Teams ($workgroup: String!="", $role_name: String!="", $first_name: String!="", $last_name: String!="") {
//     insert_moped_proj_personnel(objects: {workgroup: $workgroup, role_name: $role_name, first_name: $first_name, last_name: $last_name}) {
//       affected_rows
//       returning {
//         workgroup
//         role_name
//         first_name
//         last_name
//       }
//     }
//   }
// `; 
//   const [addStaff] = useMutation(TEAMS_MUTATION);
   
//   const handleSubmit = form => {
//   if (_.isEmpty(errors)) {
//   console.log("submit", form);
//   let project_name=form.one.newProject;
//   let project_description=form.one.ProjDesc;
//   let eCapris_id=form.one.eCaprisId;
//   let capitally_funded=form.one.capitalFunded;
//   let start_date=form.one.date;
//   let current_phase=form.one.Phase;
//   let project_priority=form.one.Priority;
//   let current_status=form.one.Status; 
//   let fiscal_year=form.one.FiscalYear;
//   addProject({variables: {project_name, project_description, eCapris_id, project_priority,current_phase, current_status, fiscal_year, capitally_funded, start_date}}); 
//   let last_name=form.two.Last;
//   let workgroup=form.two.Group;
//   let role_name=form.two.Role; 
//   addStaff({variables: {workgroup, role_name, last_name}});     
//     }
//   };
  
//   return (
//     <div>
//        <Breadcrumb
//           routeSegments={[
//               { name: "Forms", path: "/DefineProject" },
//               { name: "Define Project" }
//             ]}
//           /> 
//       <Stepper activeStep={activeStep}>
//         {steps.map((label, index) => {
//           const stepProps = {};
//           const labelProps = {};
//           return (
//             <Step key={label} {...stepProps}>
//               <StepLabel {...labelProps}>{label}</StepLabel>
//             </Step>
//           );
//         })}
//       </Stepper>
//       <div>
//         {activeStep === steps.length ? (
//           <div>
//             <>
//               <Typography>Completed</Typography>
//               <Button onClick={handleReset}>Close</Button>
//             </>
//           </div>
//         ) : (
//           <div>
//             {getStepContent(activeStep, compiledForm)}
//             <div>
//               <Button onClick={handleBack}>Back</Button>
//               <Button variant="contained" color="primary" onClick={handleNext}>
//                 {activeStep === steps.length - 1 ? "Finish" : "Next"}
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DefineProject;