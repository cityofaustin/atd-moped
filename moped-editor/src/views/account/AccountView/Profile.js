import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";

export const defaultUser = {
  avatar: `${process.env.PUBLIC_URL}/static/images/avatars/robSpillar.jpeg`,
  name: "Rob Spillar",
  jobTitle: "Director of Transportation",
  city: "Austin, TX",
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    marginBottom: 8,
  },
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Box>
            <Avatar className={classes.avatar} src={defaultUser.avatar} />
          </Box>
          <Typography color="textPrimary" gutterBottom variant="h3">
            {defaultUser.name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {defaultUser.jobTitle}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {defaultUser.city}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
