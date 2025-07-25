import React from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryMap from "src/views/projects/projectView/ProjectSummary/ProjectSummaryMap";
import ProjectSummaryStatusUpdate from "src/views/projects/projectView/ProjectSummary/ProjectSummaryStatusUpdate";

import { Grid, CardContent, CircularProgress } from "@mui/material";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";

import makeStyles from "@mui/styles/makeStyles";
import ProjectSummaryProjectWebsite from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectWebsite";
import ProjectSummaryProjectDescription from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectDescription";
import ProjectSummaryParentProjectLink from "src/views/projects/projectView/ProjectSummary/ProjectSummaryParentProjectLink";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import ProjectSummaryDataTrackerSignals from "src/views/projects/projectView/ProjectSummary/ProjectSummaryDataTrackerSignals";
import ProjectSummaryWorkOrders from "src/views/projects/projectView/ProjectSummary/ProjectSummaryWorkOrders";
import ProjectSummaryInterimID from "src/views/projects/projectView/ProjectSummary/ProjectSummaryInterimID";
import ProjectSummaryAutocomplete from "src/views/projects/projectView/ProjectSummary/ProjectSummaryAutocomplete";
import ProjectSummaryProjectPartners from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectPartners";
import ProjectSummaryCouncilDistricts from "src/views/projects/projectView/ProjectSummary/ProjectSummaryCouncilDistricts";
import ProjectSummaryComponentWorkTypes from "src/views/projects/projectView/ProjectSummary/ProjectSummaryComponentWorkTypes";

import SubprojectsTable from "src/views/projects/projectView/ProjectSummary/SubprojectsTable";
import TagsSection from "src/views/projects/projectView/ProjectSummary/TagsSection";

import {
  PROJECT_UPDATE_SPONSOR,
  PROJECT_UPDATE_LEAD,
  PROJECT_UPDATE_PUBLIC_PROCESS,
} from "../../../../queries/project";

const useStyles = makeStyles((theme) => ({
  fieldGridItem: {
    marginBottom: theme.spacing(3),
  },
  fieldLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
    paddingLeft: theme.spacing(0.5),
  },
  fieldLabelSmall: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".7rem",
    paddingLeft: theme.spacing(0.5),
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.background.summaryHover,
      borderRadius: theme.spacing(0.5),
      cursor: "pointer",
    },
    overflowWrap: "break-word",
  },
  fieldLabelTextNoHover: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
    overflowWrap: "break-word",
  },
  fieldLabelTextSpanNoBorder: {
    borderBottom: "inherit",
  },
  fieldBox: {
    width: "100%",
  },
  fieldSelectItem: {
    width: "calc(100% - 3rem)",
  },
  newStatusIconDiv: {
    display: "flex",
    alignItems: "center",
  },
  fieldLabelDataTrackerLink: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
  },
  tooltipIcon: {
    fontSize: "20px",
  },
}));

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
  const classes = useStyles();

  /* Not all child components have components and geography data */
  const childProjectGeography = data?.childProjects
    .filter((project) => project.project_geography.length > 0)
    .map((project) => project.project_geography[0]);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={0}>
              <ProjectSummaryProjectDescription
                projectId={projectId}
                data={data}
                refetch={refetch}
                classes={classes}
                handleSnackbar={handleSnackbar}
                listViewQuery={listViewQuery}
              />
              {data.moped_project[0]?.parent_project_id && (
                <ProjectSummaryParentProjectLink
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              )}
              {/*Status Update Component*/}
              <ProjectSummaryStatusUpdate
                projectId={projectId}
                data={data}
                refetch={refetch}
                handleSnackbar={handleSnackbar}
                classes={classes}
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
                  classes={classes}
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
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectPartners
                  projectId={projectId}
                  loading={loading}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                  tooltipText="Other internal or external workgroups participating in the project"
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryComponentWorkTypes
                  data={data}
                  classes={classes}
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
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectWebsite
                  projectId={projectId}
                  loading={loading}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryInterimID
                  projectId={projectId}
                  loading={loading}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectECapris
                  projectId={projectId}
                  loading={loading}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryDataTrackerSignals
                  classes={classes}
                  project={data?.moped_project?.[0]}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryWorkOrders
                  classes={classes}
                  project={data?.moped_project?.[0]}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ProjectSummaryMap data={data} />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryCouncilDistricts
                  classes={classes}
                  projectGeography={data.project_geography}
                  childProjectGeography={childProjectGeography}
                />
              </Grid>
              <Grid item xs={12}>
                <TagsSection
                  projectId={projectId}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid item xs={12}>
                {!data.moped_project[0].parent_project_id && (
                  <SubprojectsTable
                    projectId={projectId}
                    refetchSummaryData={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
