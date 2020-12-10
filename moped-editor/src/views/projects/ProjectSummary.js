import React from "react";
// import { useQuery } from "@apollo/react-hooks";
// import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
import {
  Button,
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const ProjectSummary = () => {
  const classes = useStyles();

  return (
    <Page title="Your Project Was Created Successfully">
      <Container>
        <Card className={classes.cardWrapper}>
          <Box pt={2} pl={2}>
            <CardHeader title="Project Summary" />
         
          </Box>
          <Divider />
          <CardContent>
          <h2>Query Project Name</h2>

         
          </CardContent>
          <div>
              <Divider />
                <Box pt={2} pl={2} className={classes.buttons}>
                  <Button className={classes.button}>
                  Back
                  </Button>
                </Box>
            </div>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectSummary;