import React, { useState } from "react";
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
  CircularProgress,
} from "@material-ui/core";

import {
  getSessionDatabaseData,
  setSessionDatabaseData,
  getDatabaseId,
  useUser,
} from "../../../auth/user";
import emailToInitials from "../../../utils/emailToInitials";
import { getInitials } from "src/utils/userNames";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import FileUploadDialogSimple from "../../../components/FileUpload/FileUploadDialogSimple";

import {
  ACCOUNT_USER_PROFILE_GET,
  ACCOUNT_USER_PICTURE_UPDATE,
  ACCOUNT_USER_PICTURE_DELETE,
} from "../../../queries/account";

import { useMutation, useQuery } from "@apollo/client";
import CDNAvatar from "../../../components/CDN/Avatar";
import { DeleteForever } from "@material-ui/icons";
import config from "../../../config";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    marginBottom: 8,
  },
  userInitials: {
    fontSize: "2rem",
  },
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useUser();
  const updateFailedPermissionMessage = `Error: Cannot update image, you are not allowed to update this account. Please contact the DTS team for further assistance.`;

  /**
   * @constant {boolean} dialogOpen - True to make the save dialog visible
   * @function setDialogOpen - Changes the state of the dialogOpen constant
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(ACCOUNT_USER_PROFILE_GET, {
    variables: {
      userId: config.env.APP_ENVIRONMENT === "local" ? 1 : getDatabaseId(user),
    },
  });

  const [updateAccountPicture] = useMutation(ACCOUNT_USER_PICTURE_UPDATE);

  const [deleteAccountPicture] = useMutation(ACCOUNT_USER_PICTURE_DELETE);

  const resetUserPicture = fileKey => {
    const userData = getSessionDatabaseData();
    if (userData) userData["picture"] = fileKey;
    setSessionDatabaseData(userData);
    refetch();
    window.location.reload();
  };

  /**
   * Persists the file data into the database
   * @param {Object} fileDataBundle - The file bundle as provided by the FileUpload component
   */
  const handleClickSaveFile = fileDataBundle => {
    updateAccountPicture({
      variables: {
        userId: parseInt(getDatabaseId(user)),
        picture: fileDataBundle.key,
      },
    })
      .then(resp => {
        setDialogOpen(false);
        const affected_rows = resp.data?.update_moped_users?.affected_rows ?? 0;

        if (affected_rows === 0) {
          alert(updateFailedPermissionMessage);
        } else {
          resetUserPicture(fileDataBundle.key);
        }
      })
      .catch(err => {
        if (Object.keys(err) > 0) alert(JSON.stringify(err));
      });
  };

  const handleClickDeleteFile = () => {
    deleteAccountPicture({
      variables: {
        userId: parseInt(getDatabaseId(user)),
      },
    })
      .then(resp => {
        const affected_rows = resp.data?.update_moped_users?.affected_rows ?? 0;

        if (affected_rows === 0) {
          alert(updateFailedPermissionMessage);
        } else {
          resetUserPicture(null);
        }
      })
      .catch(err => {
        if (Object.keys(err) > 0) alert(JSON.stringify(err));
      })
      .finally(() => {
        refetch();
        window.location.reload();
      });
  };

  /**
   * Handles the upload file button onClick behavior
   */
  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the cancel button onClick behavior
   */
  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  const userProfile = data
    ? "moped_users" in data && data["moped_users"].length > 0
      ? data["moped_users"][0]
      : null
    : null;

  return (
    <>
      {loading && <CircularProgress />}
      {error && (
        <Card className={clsx(classes.root, className)} {...rest}>
          <CardContent>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Box>
                <Avatar
                  className={classes.avatar}
                  src={user?.userAvatar}
                  style={{ backgroundColor: user?.userColor }}
                >
                  <Typography className={classes.userInitials}>
                    {emailToInitials(user?.idToken?.payload?.email)}
                  </Typography>
                </Avatar>
              </Box>
              <Typography color="textPrimary" gutterBottom variant="h3">
                {String(
                  user?.userName ?? user?.idToken?.payload?.email
                ).toLowerCase()}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {user?.userJobTitle ?? "Austin Transportation"}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {user?.userCity ?? "Austin, TX"}
              </Typography>
            </Box>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              fullWidth
              color="primary"
              variant="text"
              startIcon={<AddAPhotoIcon />}
              onClick={handleClickUploadFile}
            >
              Upload Picture
            </Button>
          </CardActions>
          <FileUploadDialogSimple
            title={"Upload Picture"}
            dialogOpen={dialogOpen}
            handleClickCloseUploadFile={handleClickCloseUploadFile}
            handleClickSaveFile={handleClickSaveFile}
            principal={"user"}
          />
        </Card>
      )}

      {userProfile && (
        <Card
          xs={12}
          sm={6}
          md={6}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <CardContent>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Box>
                <CDNAvatar
                  src={userProfile?.picture ?? null}
                  initials={getInitials(userProfile)}
                  largeInitials={true}
                />
              </Box>
              <Typography color="textPrimary" gutterBottom variant="h3">
                {userProfile["first_name"]} {userProfile["last_name"]}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h3">
                {String(userProfile["email"]).toLowerCase()}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {userProfile["title"] ?? "Austin Transportation"}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {userProfile["workgroup"] ?? "Austin, TX"}
              </Typography>
            </Box>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              fullWidth
              color="primary"
              variant="text"
              startIcon={<AddAPhotoIcon />}
              onClick={handleClickUploadFile}
            >
              Upload Picture
            </Button>
            <Button
              fullWidth
              color="primary"
              variant="text"
              startIcon={<DeleteForever />}
              onClick={handleClickDeleteFile}
            >
              Delete Picture
            </Button>
          </CardActions>
          <FileUploadDialogSimple
            title={"Upload Picture"}
            dialogOpen={dialogOpen}
            handleClickCloseUploadFile={handleClickCloseUploadFile}
            handleClickSaveFile={handleClickSaveFile}
            principal={"user"}
          />
        </Card>
      )}
    </>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
