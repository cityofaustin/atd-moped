import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddCircle from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

import {
  TAGS_QUERY,
  DELETE_PROJECT_TAG,
  ADD_PROJECT_TAGS,
} from "../../../../queries/tags";

const useStyles = makeStyles((theme) => ({
  paperTags: {
    padding: "8px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  chipContainer: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "1rem 0",
    paddingLeft: "16px",
    margin: 0,
  },
  chipAddContainer: {
    paddingLeft: "8px",
  },
  tagAutocomplete: {
    minWidth: "250px",
  },
  editIconFunding: {
    cursor: "pointer",
    margin: "0.5rem",
    fontSize: "1.5rem",
  },
  editIconContainer: {
    minWidth: "8rem",
    marginLeft: "8px",
  },
  editIconButton: {
    margin: "8px 0",
    padding: "8px",
  },
}));

const TagsSection = ({ projectId }) => {
  const [addTagMode, setAddTagMode] = useState(false);
  const [newTagList, setNewTagList] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const { loading, error, data, refetch } = useQuery(TAGS_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  const [addProjectTags] = useMutation(ADD_PROJECT_TAGS);
  const [deleteProjectTag] = useMutation(DELETE_PROJECT_TAG);

  const classes = useStyles();

  if (error) console.error(error);
  if (loading || !data) return <CircularProgress />;

  /**
   * Filter out already selected tags
   */
  const availableTags = () => {
    const tagsIds = data.moped_proj_tags.map((t) => t.moped_tag.id);
    const availableTags = data.moped_tags.filter(
      (t) => !tagsIds.includes(t.id)
    );
    return availableTags;
  };

  /**
   * Cancels add tag state and resets list of tags
   */
  const handleNewTagCancel = () => {
    setNewTagList([]);
    setAddTagMode(false);
  };

  /**
   * Soft deletes a tag from the project
   * @param {Object} tag -The tag
   */
  const handleTagDelete = (tag) =>
    deleteProjectTag({
      variables: {
        id: tag.id,
      },
    })
      .then(() => refetch())
      .catch((error) => {
        console.error(error);
      });

  /**
   * Adds a tag or tags to the project
   */
  const handleTagAdd = () => {
    const tagsToAdd = newTagList.map((tag) => ({
      tag_id: tag.id,
      project_id: projectId,
    }));

    return addProjectTags({
      variables: {
        objects: tagsToAdd,
      },
    })
      .then(() => refetch())
      .then(() => handleNewTagCancel());
  };

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  return (
    <ApolloErrorHandler errors={error}>
      <Paper elevation={2} className={classes.paperTags}>
        <Toolbar style={{ paddingLeft: "16px" }}>
          <Typography variant="h2" color="primary" style={{ flexGrow: 1 }}>
            Tags
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircle />}
            onClick={() => setAddTagMode(true)}
          >
            Add tag
          </Button>
        </Toolbar>
        <Box component={"ul"} className={classes.chipContainer}>
          <DeleteConfirmationModal
            type="tag"
            submitDelete={() => handleTagDelete(deleteConfirmationId)}
            isDeleteConfirmationOpen={isDeleteConfirmationOpen}
            setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
          >
            {data.moped_proj_tags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  label={tag.moped_tag.name}
                  onDelete={() => handleDeleteOpen(tag)}
                  className={classes.chip}
                />
              </li>
            ))}
          </DeleteConfirmationModal>
          {addTagMode && (
            <Box
              display="flex"
              justifyContent="flex-start"
              className={classes.chipAddContainer}
            >
              <Autocomplete
                multiple
                className={classes.tagAutocomplete}
                id="tag-autocomplete"
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => setNewTagList(value)}
                options={availableTags()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={error}
                    InputLabelProps={{ required: false }}
                    label="Tag"
                    variant="outlined"
                  />
                )}
              />
              <div className={classes.editIconContainer}>
                <IconButton
                  className={classes.editIconButton}
                  aria-label="Add"
                  onClick={handleTagAdd}
                >
                  <Icon fontSize={"small"}>check</Icon>
                </IconButton>
                <IconButton
                  className={classes.editIconButton}
                  aria-label="Cancel"
                  onClick={handleNewTagCancel}
                >
                  <Icon fontSize={"small"}>close</Icon>
                </IconButton>
              </div>
            </Box>
          )}
        </Box>
      </Paper>
    </ApolloErrorHandler>
  );
};

export default TagsSection;
