import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

import {
  TAGS_QUERY,
  DELETE_PROJECT_TAG,
  ADD_PROJECT_TAGS,
} from "../../../../queries/tags";

const useStyles = makeStyles((theme) => ({
  // fieldGridItem: {
  //   margin: theme.spacing(2),
  // },
  // linkIcon: {
  //   fontSize: "1rem",
  // },
  // syncLinkIcon: {
  //   fontSize: "1.2rem",
  // },
  paperTags: {
    padding: "8px",
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
    paddingLeft: "8px"
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

  return (
    <ApolloErrorHandler errors={error}>
      <Paper elevation={2} className={classes.paperTags}>
        <Toolbar style={{ paddingLeft: "16px" }}>
          <Typography variant="h2" color="primary">
            Tags
          </Typography>
        </Toolbar>
        <Box component={"ul"} className={classes.chipContainer}>
          {data.moped_proj_tags.map((tag) => (
            <li key={tag.id}>
              <Chip
                label={tag.moped_tag.name}
                onDelete={() => handleTagDelete(tag)}
                className={classes.chip}
              />
            </li>
          ))}
          {!addTagMode && (
            <li key={`add-task-order`}>
              <Tooltip title="Add New Tag">
                <ControlPointIcon
                  className={classes.editIconFunding}
                  onClick={() => setAddTagMode(true)}
                />
              </Tooltip>
            </li>
          )}
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
                // filterOptions={filterOptions}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => setNewTagList(value)}
                options={data.moped_tags}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={error}
                    InputLabelProps={{ required: false }}
                    label="Tag"
                    variant="outlined"
                  />
                )}
                // value={value ?? []}
                // getOptionSelected={(value, option) =>
                //   value.display_name === option.display_name
                // }
                // renderTags={(tagValue, getTagProps) =>
                //   tagValue.map((option, index) => (
                //     <Chip label={option.display_name} {...getTagProps({ index })} />
                //   ))
                // }
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
