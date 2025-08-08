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
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import Grid from "@mui/material/Grid";
import theme from "src/theme";

import {
  TAGS_QUERY,
  DELETE_PROJECT_TAG,
  ADD_PROJECT_TAGS,
} from "src/queries/tags";

const TagsSection = ({ projectId, handleSnackbar }) => {
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
      .then(() => {
        setIsDeleteConfirmationOpen(false);
        handleSnackbar(true, "Tag deleted", "success");
      })
      .catch((error) => {
        handleSnackbar(true, "Error deleting tag", "error", error);
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
      .then(() => {
        refetch();
        handleSnackbar(true, "Tag(s) added", "success");
      })
      .then(() => handleNewTagCancel())
      .catch((error) => {
        handleSnackbar(true, "Error adding tag(s)", "error", error);
      });
  };

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  return (
    <ApolloErrorHandler errors={error}>
      <Paper
        elevation={2}
        sx={{
          padding: "12px",
        }}
      >
        <Toolbar sx={{ paddingRight: "2px" }} disableGutters={true}>
          <Typography variant="h2" color="primary" sx={{ flexGrow: 1 }}>
            Tags
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<AddCircle />}
            onClick={() => setAddTagMode(true)}
          >
            Add tag
          </Button>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            flexWrap: "wrap",
            listStyle: "none",
            padding: (theme) => {
              {
                theme.spacing(1);
              }
              {
                theme.spacing(2);
              }
            },
            paddingRight: 0,
            margin: 0,
          }}
        >
          <DeleteConfirmationModal
            type="tag"
            submitDelete={() => handleTagDelete(deleteConfirmationId)}
            isDeleteConfirmationOpen={isDeleteConfirmationOpen}
            setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
          >
            <Grid container spacing={1}>
              {data.moped_proj_tags.map((tag) => (
                <Grid item key={tag.id}>
                  <Chip
                    key={tag.id}
                    label={tag.moped_tag.name}
                    onDelete={() => handleDeleteOpen(tag)}
                    sx={{
                      height: "auto",
                      minHeight: theme.spacing(4),
                      "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </DeleteConfirmationModal>
          {addTagMode && (
            <Box
              display="flex"
              justifyContent="flex-start"
              sx={{
                padding: theme.spacing(1),
              }}
            >
              <Autocomplete
                multiple
                sx={{ minWidth: "250px" }}
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
              <Box
                sx={{
                  minWidth: "8rem",
                  marginLeft: "8px",
                }}
              >
                <IconButton
                  sx={{
                    margin: "8px 0",
                    padding: "8px",
                  }}
                  aria-label="Add"
                  onClick={handleTagAdd}
                  size="large"
                >
                  <Icon fontSize={"small"}>check</Icon>
                </IconButton>
                <IconButton
                  sx={{
                    margin: "8px 0",
                    padding: "8px",
                  }}
                  aria-label="Cancel"
                  onClick={handleNewTagCancel}
                  size="large"
                >
                  <Icon fontSize={"small"}>close</Icon>
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </ApolloErrorHandler>
  );
};

export default TagsSection;
