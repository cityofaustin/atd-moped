import React from "react";
import DisplayAllComments from "./DisplayAllComments";
import Page from "src/components/Page";
import { Container, Card, Divider } from "@material-ui/core";

const ProjectComments = () => {
  return (
    <Page title="Project Notes Page">
      <Container>
        <Card>
          <DisplayAllComments />
          <Divider />
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectComments;
