import React from "react";
import DisplayAllNotes from "./DisplayAllNotes";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
import { Container, Card, Divider } from "@material-ui/core";

const ProjectNotes = () => {
  const classes = useStyles();

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
