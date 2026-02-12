import React from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryMap from "src/views/projects/projectView/ProjectSummary/ProjectSummaryMap";
import ProjectSummaryStatusUpdate from "src/views/projects/projectView/ProjectSummary/ProjectSummaryStatusUpdate";

import {
  Grid,
  CardContent,
  CircularProgress,
  Card,
  Typography,
} from "@mui/material";

import ProjectSummaryProjectWebsite from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectWebsite";
import ProjectSummaryProjectDescription from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectDescription";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import ProjectSummaryDataTrackerSignals from "src/views/projects/projectView/ProjectSummary/ProjectSummaryDataTrackerSignals";
import ProjectSummaryWorkOrders from "src/views/projects/projectView/ProjectSummary/ProjectSummaryWorkOrders";
import ProjectSummaryInterimID from "src/views/projects/projectView/ProjectSummary/ProjectSummaryInterimID";
import ProjectSummaryAutocomplete from "src/views/projects/projectView/ProjectSummary/ProjectSummaryAutocomplete";
import ProjectSummaryProjectPartners from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectPartners";
import ProjectSummaryCouncilDistricts from "src/views/projects/projectView/ProjectSummary/ProjectSummaryCouncilDistricts";

import SubprojectsTable from "src/views/projects/projectView/ProjectSummary/SubprojectsTable";
import TagsSection from "src/views/projects/projectView/ProjectSummary/TagsSection";

import {
  PROJECT_UPDATE_SPONSOR,
  PROJECT_UPDATE_LEAD,
  PROJECT_UPDATE_PUBLIC_PROCESS,
} from "src/queries/project";

/**
 * Project Summary Component
 * @param {boolean} loading - True if it is loading
 * @param {Object} error - Error content if provided
 * @param {Object} data - The query data
 * @param {function} refetch - A function to reload the data
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummary = ({
  loading,
  error,
  data,
  refetch,
  listViewQuery,
  handleSnackbar,
}) => {
  const { projectId } = useParams();

  /* Not all child components have components and geography data */
  const childProjectGeography = data?.childProjects
    .filter((project) => project.project_geography.length > 0)
    .map((project) => project.project_geography[0]);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "fit-content" }}>
            <CardContent>
              <Typography variant="h2" color="primary" sx={{ mb: 3 }}>
                Overview
              </Typography>
              <Grid container spacing={0}>
                <ProjectSummaryProjectDescription
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  handleSnackbar={handleSnackbar}
                  listViewQuery={listViewQuery}
                />
                {/*Status Update Component*/}
                <ProjectSummaryStatusUpdate
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  handleSnackbar={handleSnackbar}
                />
                <Grid item xs={12}>
                  <ProjectSummaryAutocomplete
                    field="Lead"
                    idColumn={"entity_id"}
                    nameColumn={"entity_name"}
                    initialValue={data?.moped_project[0]?.moped_project_lead}
                    optionList={data?.moped_entity ?? []}
                    updateMutation={PROJECT_UPDATE_LEAD}
                    tooltipText="Division, department, or organization responsible for successful project implementation"
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryAutocomplete
                    field="Sponsor"
                    idColumn={"entity_id"}
                    nameColumn={"entity_name"}
                    initialValue={data?.moped_project[0]?.moped_entity}
                    optionList={data?.moped_entity ?? []}
                    updateMutation={PROJECT_UPDATE_SPONSOR}
                    tooltipText="Division, department, or organization who is the main contributor of funds for the project"
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryProjectPartners
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                    tooltipText="Other internal or external workgroups participating in the project"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryAutocomplete
                    field="Public process"
                    idColumn={"id"}
                    nameColumn={"name"}
                    initialValue={
                      data?.moped_project[0]?.moped_public_process_statuses
                    }
                    optionList={data?.moped_public_process_statuses ?? []}
                    updateMutation={PROJECT_UPDATE_PUBLIC_PROCESS}
                    tooltipText="Current public phase of a project"
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryProjectWebsite
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryInterimID
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    loading={loading}
                    eCaprisSubprojectId={
                      data?.moped_project?.[0]?.ecapris_subproject_id
                    }
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryDataTrackerSignals
                    project={data?.moped_project?.[0]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProjectSummaryWorkOrders
                    project={data?.moped_project?.[0]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ height: "fit-content" }}>
                <CardContent>
                  <Typography variant="h2" color="primary" sx={{ mb: 3 }}>
                    Map
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <ProjectSummaryMap data={data} />
                    </Grid>
                    <Grid item xs={12}>
                      <ProjectSummaryCouncilDistricts
                        projectGeography={data.project_geography}
                        childProjectGeography={childProjectGeography}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Tags Section */}
            <Grid item xs={12}>
              <TagsSection
                projectId={projectId}
                handleSnackbar={handleSnackbar}
              />
            </Grid>

            {/* Subprojects Section */}
            <Grid item xs={12}>
              <Card sx={{ height: "fit-content", p: 0 }}>
                {/* The `&:last-child` is used to remove the padding from the bottom of the Table making it flush with the card layout */}
                <CardContent sx={{ "&:last-child": { p: 0 } }}>
                  <SubprojectsTable
                    projectId={projectId}
                    refetchSummaryData={refetch}
                    handleSnackbar={handleSnackbar}
                    isSubproject={!!data.moped_project[0]?.parent_project_id}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectSummary;
