import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import {
  Box,
  Card,
  Container,
  Grid,
  Breadcrumbs,
  makeStyles,
  Link,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
}));

const NewProjectView = () => {
    const classes = useStyles();

    const handleClick = () => {}

    return ( 
        <Page
            className={classes.root}
            title="New Project"
        >
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" onClick={handleClick}>
                    Material-UI
                </Link>
                <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                    Core
                </Link>
                <Typography color="textPrimary">Breadcrumb</Typography>
            </Breadcrumbs>
            <Container maxWidth={false}>
                <Card>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h2"
                    >
                        New Project View
                    </Typography>
                </Card>
            </Container>
        </Page>

    );
}
 
export default NewProjectView;