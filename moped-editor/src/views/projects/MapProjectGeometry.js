import React from "react";
import { TextField, Card, Container, makeStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const MapProjectGeometry= () => {

  const classes = useStyles();

  let options = ["option 1", "option 2", "option 3"];

  return (
    <Page className={classes.root} title="Map Project">
       <Container maxWidth={false}>
         <Card>
          <div>
            <form>
            <Autocomplete
                id="selectedOptions"
                options={options}
                style={{ width: 150 }}
                renderInput={(params) => <TextField {...params} label="Options"
                margin="normal" />}
              />
            </form>
          </div>
        </Card>
      </Container>
    </Page>
  );
}

export default MapProjectGeometry;