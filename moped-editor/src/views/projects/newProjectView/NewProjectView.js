import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Container, Card, CardContent } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import DefineProjectForm from "./DefineProjectForm";
import Page from "src/components/Page";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT, PROJECT_FOLLOW } from "src/queries/project";

import { getSessionDatabaseData } from "src/auth/user";

import { generateProjectComponent } from "src/utils/signalComponentHelpers";

/**
 * Styles
 */
const useStyles = makeStyles((theme) => ({
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

  // user data
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData?.user_id;

  /**
   * Add Project Apollo Mutation
   */
  const [addProject] = useMutation(ADD_PROJECT);

  const [followProject] = useMutation(PROJECT_FOLLOW);

  /**
   * Timer Reference Object
   * @type {React.MutableRefObject}
   */
  const timer = useRef();

  /**
   * Persists a new project into the database
   */
  const handleSave = (formData) => {
    // Validate project nam
    console.log(formData);
    const { isSignal, signal, projectName, projectSecondaryName, description } =
      formData;

    setLoading(true);

    /**
     * We now must generate the payload with variables for our GraphQL query.
     * If it is a signal asset, include moped_proj_components, otherwise only the project details
     * @type {Object}
     */
    const variablePayload = {
      object: {
        project_name: projectName,
        project_description: description,
        project_name_secondary:
          projectSecondaryName.length > 0 ? projectSecondaryName : null,
        added_by: userId,
        // We need to add the potential phase as a default
        moped_proj_phases: {
          data: [
            {
              phase_id: 1,
              is_current_phase: true,
              phase_start: new Date(new Date().setHours(0, 0, 0, 0)),
              is_phase_start_confirmed: true,
            },
          ],
        },
        // Append moped_proj_components object if fromSignalAsset is true
        // TODO: Figure out if we have this data in the signal object
        ...(isSignal
          ? {
              moped_proj_components: {
                data: [
                  generateProjectComponent(
                    signal,
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
      .then((response) => {
        // Capture the project ID, which will be used to redirect to the Project Summary page
        const { project_id } = response.data.insert_moped_project_one;
        setNewProjectId(project_id);
        // Add project to user's following list
        followProject({
          variables: {
            object: {
              project_id: project_id,
              user_id: userId,
            },
          },
        });
      })
      // If there is an error, we must show it...
      .catch((err) => {
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

  return (
    <Page title="New project">
      <Container>
        <Card className={classes.cardWrapper}>
          <CardContent>
            <div>
              <DefineProjectForm
                loading={loading}
                success={success}
                handleSave={handleSave}
                classes={classes}
              />
            </div>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default NewProjectView;
