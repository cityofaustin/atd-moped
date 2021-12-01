import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Container,
  Card,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";
import DefineProjectForm from "./DefineProjectForm";
import Page from "src/components/Page";
import { useQuery, useMutation } from "@apollo/client";
import { SIGNAL_COMPONENTS_QUERY } from "../../../queries/project";

import {
  ADD_PROJECT,
  UPDATE_NEW_PROJ_FEATURES,
} from "../../../queries/project";

import ProjectSaveButton from "./ProjectSaveButton";
import {
  useSignalStateManager,
  generateProjectComponent,
} from "src/utils/signalComponentHelpers";

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
   * Form State
   * @type {Object} projectDetails - The current state of project details
   * @type {boolean} nameError - When true, it denotes an error in the name
   * @type {boolean} descriptionError - When true, it denotes an error in the project description
   * @type {Object} featureCollection - The final GeoJSON to be inserted into a component
   * @type {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
   * @type {Boolean} signalError - If the current signal value is in validation error
   * @type {Boolean} fromSignalAsset - if signal autocomplete switch is active. If true,
   *    the project name and featureCollection will be set from the `signal` value.
   */
  const [projectDetails, setProjectDetails] = useState({
    current_phase: "potential",
    project_description: "",
    project_name: "",
    start_date: format(Date.now(), "yyyy-MM-dd"),
    current_status: "active",
    status_id: 1,
  });

  const {
    error: componentQueryError,
    loading: componentQueryloading,
    data: componentData,
  } = useQuery(SIGNAL_COMPONENTS_QUERY);

  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });

  /**
   * Signal component state management
   */
  const [signal, setSignal] = useState("");
  const [fromSignalAsset, setFromSignalAsset] = useState(false);
  useSignalStateManager(fromSignalAsset, setSignal, setFeatureCollection);
  const [signalError, setSignalError] = useState(false);

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
   * Persists a new project into the database
   */
  const handleSubmit = () => {
    const newSignalError = fromSignalAsset && !Boolean(signal);
    setSignalError(newSignalError);

    if (projectDetails.project_name.trim().length === 0) {
      setNameError(true);
    }
    if (projectDetails.project_description.trim().length === 0) {
      setDescriptionError(true);
    }

    if (
      projectDetails.project_name.trim().length > 0 &&
      projectDetails.project_description.trim().length > 0
    ) {
      setLoading(true);

      /**
       * We now must generate the payload with variables for our GraphQL query.
       * If it is a signal asset, include moped_proj_components, otherwise only the project details
       * @type {Object}
       */
      const variablePayload = {
        object: {
          // First we need to copy the project details
          ...projectDetails,

          // We need to add the potential phase as a default
          moped_proj_phases: {
            data: [
              {
                phase_name: "potential",
                is_current_phase: true,
                status_id: 1,
                completion_percentage: 0,
                completed: false,
                phase_start: format(Date.now(), "yyyy-MM-dd"),
              },
            ],
          },
          // Append moped_proj_components object if fromSignalAsset is true
          ...(fromSignalAsset
            ? {
                moped_proj_components: {
                  data: [
                    generateProjectComponent(
                      featureCollection,
                      fromSignalAsset,
                      componentData["moped_components"]
                    ),
                  ],
                },
              }
            : {}),
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

          // if moped_proj_components exist, update features before setting project id
          if (moped_proj_components[0]) {
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
          } else {
            setNewProjectId(project_id);
          }
        })
        // If there is an error, we must show it...
        .catch(err => {
          alert(err);
          setLoading(false);
          setSuccess(false);
        });
    }
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

  if (componentQueryloading) {
    return <CircularProgress />;
  }
  if (componentQueryError) return `Error! ${componentQueryError.message}`;

  return (
    <Page title="New project">
      <Container>
        <Card className={classes.cardWrapper}>
          <CardContent>
            <div>
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
              <Box pt={2} pl={2} className={classes.buttons}>
                <ProjectSaveButton
                  label={"Create"}
                  loading={loading}
                  success={success}
                  handleButtonClick={handleSubmit}
                />
              </Box>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default NewProjectView;
