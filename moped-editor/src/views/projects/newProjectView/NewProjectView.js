import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Container, Paper } from "@mui/material";
import DefineProjectForm from "./DefineProjectForm";
import Page from "src/components/Page";
import { useQuery, useMutation } from "@apollo/client";
import {
  SIGNAL_COMPONENTS_QUERY,
  ADD_PROJECT,
  PROJECT_FOLLOW,
} from "src/queries/project";
import { knackSignalRecordToFeatureSignalsRecord } from "src/utils/signalComponentHelpers";

import { useSessionDatabaseData } from "src/auth/user";

import { generateProjectComponent } from "src/utils/signalComponentHelpers";

/**
 * New Project View
 * @return {JSX.Element}
 * @constructor
 */
const NewProjectView = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newProjectId, setNewProjectId] = useState(null);

  // Redirect handlers
  const navigate = useNavigate();

  // user data
  const userSessionData = useSessionDatabaseData();
  const userId = userSessionData?.user_id;

  /**
   * Signals query
   */
  const {
    error: componentQueryError,
    loading: componentQueryloading,
    data: componentData,
  } = useQuery(SIGNAL_COMPONENTS_QUERY);

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
    const {
      isSignalProject,
      signal,
      projectName,
      projectSecondaryName,
      description,
    } = formData;

    const payload = {
      project_name: projectName,
      project_name_secondary:
        projectSecondaryName?.length > 0 ? projectSecondaryName : null,
      project_description: description,
      added_by: userId,
      // Use potential phase as default
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
    };

    if (isSignalProject) {
      // Use signal location name as project name
      payload.project_name = signal?.properties?.location_name || "";

      const signalFeature = knackSignalRecordToFeatureSignalsRecord(signal);
      const insertableComponent = generateProjectComponent(
        signalFeature,
        isSignalProject,
        componentData["moped_components"]
      );

      payload.moped_proj_components = {
        data: [insertableComponent],
      };
    }

    setLoading(true);

    addProject({
      variables: { object: payload },
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

  if (componentQueryloading) {
    return <CircularProgress />;
  }
  if (componentQueryError) return `Error! ${componentQueryError.message}`;

  return (
    <Page title="New project">
      <Container>
        <Paper sx={{ mt: 3 }}>
          <DefineProjectForm
            loading={loading}
            success={success}
            handleSave={handleSave}
          />
        </Paper>
      </Container>
    </Page>
  );
};

export default NewProjectView;
