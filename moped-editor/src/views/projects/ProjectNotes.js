import React from "react";
import DisplayAllNotes from "./DisplayAllNotes";
import Page from "src/components/Page";
import { Container, Card, Divider } from "@material-ui/core";

const ProjectNotes = () => {
  return (
    <Page title="Project Notes Page">
      <Container>
        <Card className={classes.cardWrapper}>
          <DisplayAllNotes />
          <Divider />
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectNotes;
