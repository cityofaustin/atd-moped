import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsListViewTable from "./ProjectsListViewTable";
import FallbackComponent from "src/components/FallbackComponent";

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  return (
    <Page title="Projects">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ProjectsListViewTable title={"Projects"} />
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsListView;
