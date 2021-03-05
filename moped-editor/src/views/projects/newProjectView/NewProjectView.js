import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import moment from "moment";
import DefineProjectForm from "./DefineProjectForm";
import NewProjectTeam from "./NewProjectTeam";
import NewProjectMap from "./NewProjectMap";
import Page from "src/components/Page";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT, ADD_PROJECT_PERSONNEL } from "../../../queries/project";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import { sumFeaturesSelected } from "../../../utils/mapHelpers";

import ProjectSaveButton from "./ProjectSaveButton";

/**
 * Styles
 */
const useStyles = makeStyles(theme => ({
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * New Project View
 * @return {JSX.Element}
 * @constructor
 */
const NewProjectView = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newProjectId, setNewProjectId] = useState(null);

  // Redirect handlers
  const navigate = useNavigate();

  /**
   * Whenever we have a new project id, we can then set success
   * and trigger the redirect.
   */
  useEffect(() => {
    if (!!newProjectId) {
      window.setTimeout(() => {
        setSuccess(true);
      }, 1500);
    }
  }, [newProjectId]);

  useEffect(() => {
    if (!!newProjectId && success) {
      window.setTimeout(() => {
        navigate("/moped/projects/" + newProjectId);
      }, 800);
    }
  }, [success, newProjectId, navigate]);

  const [activeStep, setActiveStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    fiscal_year: "",
    current_phase: "",
    project_priority: "",
    project_description: "",
    project_name: "",
    start_date: moment().format("YYYY-MM-DD"),
    current_status: "",
    capitally_funded: false,
    eCapris_id: "",
  });

  const [personnel, setPersonnel] = useState([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState({});
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const [areNoFeaturesSelected, setAreNoFeaturesSelected] = useState(false);

  // Reset areNoFeatures once a feature is selected
  useEffect(() => {
    if (sumFeaturesSelected(selectedLayerIds) > 0) {
      setAreNoFeaturesSelected(false);
    }
  }, [selectedLayerIds]);

  const getSteps = () => {
    return [
      { label: "Define project" },
      { label: "Assign team" },
      {
        label: "Map project",
        error: "Please select a location",
        isError: areNoFeaturesSelected,
      },
    ];
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <DefineProjectForm
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
          />
        );
      case 1:
        return (
          <NewProjectTeam personnel={personnel} setPersonnel={setPersonnel} />
        );
      case 2:
        return (
          <NewProjectMap
            selectedLayerIds={selectedLayerIds}
            setSelectedLayerIds={setSelectedLayerIds}
            featureCollection={featureCollection}
            setFeatureCollection={setFeatureCollection}
          />
        );
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

  const [addProject] = useMutation(ADD_PROJECT);

  const [addStaff] = useMutation(ADD_PROJECT_PERSONNEL);

  const timer = React.useRef();

  React.useEffect(() => {
    const currentTimer = timer.current;

    return () => {
      clearTimeout(currentTimer);
    };
  }, []);

  const handleSubmit = () => {
    if (sumFeaturesSelected(selectedLayerIds) === 0) {
      setAreNoFeaturesSelected(true);
      return;
    } else {
      setAreNoFeaturesSelected(false);
    }

    // Change the initial state...
    setLoading(true);

    addProject({
      variables: {
        ...projectDetails,
        project_extent_ids: selectedLayerIds,
        project_extent_geojson: featureCollection,
      },
    })
      .then(response => {
        const { project_id } = response.data.insert_moped_project.returning[0];

        const cleanedPersonnel = personnel.map(row => ({
          ...filterObjectByKeys(row, ["tableData"]),
          project_id,
        }));

        addStaff({
          variables: {
            objects: cleanedPersonnel,
          },
        })
          .then(() => {
            setNewProjectId(project_id);
          })
          .catch(err => {
            alert(err);
            setLoading(false);
            setSuccess(false);
          });
      })
      .catch(err => {
        alert(err);
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <>
      {
        <Page title="New Project">
          <Container>
            <Card className={classes.cardWrapper}>
              <Box pt={2} pl={2}>
                <CardHeader title="New Project" />
              </Box>
              <Divider />
              <CardContent>
                <Stepper activeStep={activeStep}>
                  {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={step.label} {...stepProps}>
                        {step.isError ? (
                          <StepLabel error={true}>{step.error}</StepLabel>
                        ) : (
                          <StepLabel {...labelProps}>{step.label}</StepLabel>
                        )}
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
                        {activeStep === steps.length - 1 ? (
                          <ProjectSaveButton
                            label={"Finish"}
                            loading={loading}
                            success={success}
                            handleButtonClick={handleSubmit}
                          />
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Container>
        </Page>
      }
    </>
  );
};

export default NewProjectView;
