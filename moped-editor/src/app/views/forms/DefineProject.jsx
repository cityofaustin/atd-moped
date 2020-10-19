import React from "react";
import { useFormContext } from "react-hook-form";
import _ from "lodash";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DefineFormOne from './DefineFormOne';
import DefineFormTwo from './DefineFormTwo';
import DefineFormThree from './DefineFormThree';
import { Breadcrumb } from "matx"; 

function getSteps() {
  return ["One", "Two", "Three"];
}

function getStepContent(step, formContent) {
  switch (step) {
    case 0:
      return <DefineFormOne {...{ formContent }} />;
    case 1:
      return <DefineFormTwo {...{ formContent }} />;
    case 2:
      return <DefineFormThree {...{ formContent }} />;
    default:
      return "Unknown step";
  }
}

export const DefineProject = () => {
  const { watch, errors } = useFormContext();
  const [activeStep, setActiveStep] = React.useState(0);
  const [compiledForm, setCompiledForm] = React.useState({});
  const steps = getSteps();
  const form = watch();

  const handleNext = () => {
    let canContinue = true;

    switch (activeStep) {
      case 0:
        setCompiledForm({ ...compiledForm, one: form });
        canContinue = true;
        break;
      case 1:
        setCompiledForm({ ...compiledForm, two: form });
        canContinue = true;
        break;
      case 2:
        setCompiledForm({ ...compiledForm, three: form });
        canContinue = handleSubmit({ ...compiledForm, three: form });
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
          setCompiledForm({ ...compiledForm, two: form });
          break;
        case 2:
          setCompiledForm({ ...compiledForm, three: form });
          break;
        default:
          return "not a valid step";
      }
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompiledForm({});
  };

  const handleSubmit = form => {
    if (_.isEmpty(errors)) {
      console.log("submit", form);
    }
  };

  return (
    <div>
       <Breadcrumb
          routeSegments={[
              { name: "Forms", path: "/DefineProject" },
              { name: "Define Project" }
            ]}
          /> 
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
            {getStepContent(activeStep, compiledForm)}
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

export default DefineProject;