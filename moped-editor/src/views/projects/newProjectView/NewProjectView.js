import React, { useEffect, useRef, useState } from "react";
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
import { format } from "date-fns";
import DefineProjectForm from "./DefineProjectForm";
import NewProjectTeam from "./NewProjectTeam";
import NewProjectMap from "./NewProjectMap";
import ProjectSummaryMap from "../projectView/ProjectSummaryMap";
import Page from "src/components/Page";
import { useMutation } from "@apollo/client";
import {
  ADD_PROJECT,
  UPDATE_NEW_PROJ_FEATURES,
} from "../../../queries/project";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import {
  countFeatures,
  mapErrors,
  mapConfig,
  useSaveActionReducer,
} from "../../../utils/mapHelpers";

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
 * Component definitions. The component_id must match a valid component in the
 * moped_components DB lookup table.
 */
const COMPONENT_DEFINITIONS = {
  generic: {
    name: "Extent",
    description: "New Project Feature Extent",
    component_id: 0,
  },
  phb: {
    name: "PHB",
    description: "Pedestrian ssignal",
    component_id: 16,
  },
  traffic: {
    name: "Traffic signal",
    description: "Traffic signal",
    component_id: 18,
  },
};

/**
 * Get's the correct COMPONENT_DEFIINITION property based on the presence of a signal feature
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @return {Object} - The component definition pboject
 */
const getComponentDef = (featureCollection, fromSignalAsset) => {
  const signalType = fromSignalAsset
    ? featureCollection.features[0].properties?.signal_type?.toLowerCase()
    : null;
  return signalType
    ? COMPONENT_DEFINITIONS[signalType]
    : COMPONENT_DEFINITIONS.generic;
};

/**
 * Generates a project component object that can be used in mutation.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @return {Object} - The component mutation object
 */
const generateProjectComponent = (featureCollection, fromSignalAsset) => {
  const componentDef = getComponentDef(featureCollection, fromSignalAsset);
  return {
    name: "Extent",
    description: "Project full extent",
    component_id: componentDef.component_id,
    status_id: 1,
    moped_proj_features_components: {
      data: featureCollection.features.map(feature => ({
        name: componentDef.name,
        description: componentDef.description,
        status_id: 1,
        moped_proj_feature_object: {
          data: {
            status_id: 1,
            location: feature,
          },
        },
      })),
    },
  };
};

/**
 * Resets featureCollection and signal when fromSignalAsset toggle changes. Ensures we keep
 * form state clean.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {func} setSignal - signal state setter
 * @param {Object} setFeatureCollection - featureCollection state setter
 */
const useSignalStateManager = (fromSignal, setSignal, setFeatureCollection) => {
  useEffect(() => {
    setFeatureCollection({
      type: "FeatureCollection",
      features: [],
    });
    setSignal("");
  }, [setFeatureCollection, fromSignal, setSignal]);
};

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
   * Form State
   * @type {Number} activeStep - The current step being rendered
   * @type {Object} projectDetails - The current state of project details
   * @type {boolean} nameError - When true, it denotes an error in the name
   * @type {boolean} descriptionError - When true, it denotes an error in the project description
   * @type {Object[]} personnel - An array of objects containing the personnel data
   * @type {Object} featureCollection - The final GeoJSON to be inserted into a component
   * @type {boolean} areNoFeaturesSelected - True when no features are selected
   * @type {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
   * @type {Boolean} signalError - If the current signal value is in validation error
   * @type {Boolean} fromSignalAsset - if signal autocomplete switch is active. If true,
   *    the project name and featureCollection will be set from the `signal` value.
   */
  const [activeStep, setActiveStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    fiscal_year: "",
    current_phase: "",
    project_description: "",
    project_name: "",
    start_date: format(Date.now(), "yyyy-MM-dd"),
    current_status: "",
    capitally_funded: false,
    ecapris_subproject_id: null,
  });

  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [areNoFeaturesSelected, setAreNoFeaturesSelected] = useState(false);
  const [signal, setSignal] = useState("");
  const [fromSignalAsset, setFromSignalAsset] = useState(false);
  useSignalStateManager(fromSignalAsset, setSignal, setFeatureCollection);
  const [signalError, setSignalError] = useState(false);

  // Reset areNoFeaturesSelected once a feature is selected to remove error message
  useEffect(() => {
    if (
      countFeatures(featureCollection) >= mapConfig.minimumFeaturesInProject
    ) {
      setAreNoFeaturesSelected(false);
    }
  }, [featureCollection]);

  /**
   * Generates an object with labels for the steps
   * @return {Object[]}
   */
  const getSteps = () => {
    return [
      { label: "Define project" },
      { label: "Assign team" },
      {
        label: "Map project",
        error: mapErrors.minimumLocations,
        isError: areNoFeaturesSelected,
      },
    ];
  };

  /**
   * Returns a component for a specific step number
   * @param {Number} step - The step number component to render
   * @return {JSX.Element|string}
   */
  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <DefineProjectForm
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            nameError={nameError}
            descriptionError={descriptionError}
            setFeatureCollection={setFeatureCollection}
            fromSignalAsset={fromSignalAsset}
            setFromSignalAsset={setFromSignalAsset}
            signal={signal}
            signalError={signalError}
            setSignal={setSignal}
          />
        );
      case 1:
        return (
          <NewProjectTeam personnel={personnel} setPersonnel={setPersonnel} />
        );
      case 2:
        return (
          <>
            {/* render static/not editable map if using signal */}
            {fromSignalAsset && (
              <ProjectSummaryMap projectExtentGeoJSON={featureCollection} />
            )}
            {!fromSignalAsset && (
              <NewProjectMap
                data-name={"moped-newprojectview-newprojectmap"}
                featureCollection={featureCollection}
                setFeatureCollection={setFeatureCollection}
                projectId={null}
                refetchProjectDetails={null}
                noPadding={true}
                projectFeatureCollection={null}
                newFeature={false}
                saveActionState={saveActionState}
                saveActionDispatch={saveActionDispatch}
                componentEditorPanel={null}
              />
            )}
          </>
        );
      default:
        return "Unknown step";
    }
  };

  /**
   * A constant object with all the steps generated by getSteps
   * @constant
   * @type {Object}
   */
  const steps = getSteps();

  /**
   * Handles the logic for the "Next" button
   * @return {string}
   */
  const handleNext = () => {
    let nameError = projectDetails.project_name.length === 0;
    let descriptionError = projectDetails.project_description.length === 0;
    let signalError = fromSignalAsset && !Boolean(signal);
    let canContinue = false;

    if (!nameError && !descriptionError && !signalError) {
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
    }
    if (canContinue) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    setNameError(nameError);
    setDescriptionError(descriptionError);
    setSignalError(signalError);
  };

  /**
   * Handles the back step button logic
   * @return {string}
   */
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

  /**
   * Handles the reset button logic
   */
  const handleReset = () => {
    setActiveStep(0);
  };

  /**
   * Add Project Apollo Mutation
   */
  const [addProject] = useMutation(ADD_PROJECT);
  const [updateFeatures] = useMutation(UPDATE_NEW_PROJ_FEATURES);

  /**
   * Timer Reference Object
   * @type {React.MutableRefObject}
   */
  const timer = useRef();

  /**
   * saveActionState contains the current save state
   * saveActionDispatch allows us to update the state via action (signal) dispatch.
   */
  const { saveActionState, saveActionDispatch } = useSaveActionReducer();

  const handleSubmitDispatch = () => {
    // Check this is not already done
    if (saveActionState?.currentStep === 0) {
      saveActionDispatch({ type: "initiateFeatureSave" });
    }
  };

  /**
   * Persists a new project into the database
   */
  const handleSubmit = () => {
    if (countFeatures(featureCollection) < mapConfig.minimumFeaturesInProject) {
      setAreNoFeaturesSelected(true);
      return;
    } else {
      setAreNoFeaturesSelected(false);
    }

    // Change the initial state...
    setLoading(true);

    // A variable array of objects
    let cleanedPersonnel = [];

    // If personnel are added to the project, handle roles and remove unneeded data
    personnel
      // We need to flatten (reverse the nesting) for role_ids
      .forEach(item => {
        // For every personnel, iterate through role_ids
        item.role_id.forEach((role_id, index) => {
          cleanedPersonnel.push({
            role_id: role_id,
            user_id: item.user_id,
            status_id: 1,
            notes: index === 0 ? item?.notes ?? null : null,
          });
        });
      });

    cleanedPersonnel = cleanedPersonnel.map(row => ({
      ...filterObjectByKeys(row, ["tableData"]),
    }));

    /**
     * We now must generate the payload with variables for our GraphQL query.
     * @type {Object}
     */
    const variablePayload = {
      object: {
        // First we need to copy the project details
        ...projectDetails,
        // Next we generate the project extent component
        moped_proj_components: {
          data: [generateProjectComponent(featureCollection, fromSignalAsset)],
        },
        // Finally we provide the project personnel
        moped_proj_personnel: { data: cleanedPersonnel },
      },
    };

    /**
     * Persist the new project to database
     */
    addProject({
      variables: variablePayload,
    })
      // On success
      .then(response => {
        // Destructure the data we need from the response
        const {
          project_id,
          moped_proj_components,
        } = response.data.insert_moped_project_one;

        // Retrieve the feature_ids that need to be updated
        const featuresToUpdate = moped_proj_components[0].moped_proj_features_components.map(
          featureComponent => featureComponent.moped_proj_feature.feature_id
        );

        // Persist the feature updates, we must.
        updateFeatures({
          variables: {
            featureList: featuresToUpdate,
            projectId: project_id,
          },
        })
          .then(() => setNewProjectId(project_id))
          .catch(err => {
            alert(err);
            setNewProjectId(project_id);
          });
      })
      // If there is an error, we must show it...
      .catch(err => {
        alert(err);
        setLoading(false);
        setSuccess(false);
      });
  };

  /**
   * Whenever we have a new project id, we can then set success
   * and trigger the redirect.
   */

  useEffect(() => {
    const currentTimer = timer.current;

    return () => {
      clearTimeout(currentTimer);
    };
  }, []);

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

  useEffect(() => {
    // If the features are saved or we picked from signal list, then we are good to go!
    if (
      (saveActionState?.currentStep && saveActionState.currentStep === 2) ||
      (fromSignalAsset && signal)
    ) {
      handleSubmit();
    }
    // handleSubmit changes on every render, cannot be a dependency
    // eslint-disable-next-line
  }, [saveActionState]);

  return (
    <>
      {
        <Page title="New project">
          <Container>
            <Card className={classes.cardWrapper}>
              <Box pt={2} pl={2}>
                <CardHeader title="New project" />
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
                        {activeStep > 0 && (
                          <Button
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                        )}
                        {activeStep === steps.length - 1 ? (
                          <ProjectSaveButton
                            label={"Finish"}
                            loading={loading}
                            success={success}
                            handleButtonClick={handleSubmitDispatch}
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
