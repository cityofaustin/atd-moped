import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

import {
  TAGS_QUERY,
  DELETE_PROJECT_TAG
} from "../../../../queries/tags";
import typography from "../../../../theme/typography";

const useStyles = makeStyles((theme) => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  syncLinkIcon: {
    fontSize: "1.2rem",
  },
  chipContainer: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "2rem 0",
    margin: 0,
  },
}));

const TagsSection = ({ projectId }) => {

  const [addTagMode, setAddTagMode] = useState(false);
  const [newTagList, setNewTagList] = useState([]);

  const { loading, error, data, refetch } = useQuery(TAGS_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  // const [updateProjectTags] = useMutation(UPDATE_PROJECT_TAGS);
  const [deleteProjectTag] = useMutation(DELETE_PROJECT_TAG);

  const classes = useStyles();

  if (error) console.error(error);
  if (loading || !data) return <CircularProgress />

  console.log(data)

  const handleNewTagCancel = () => {
    setNewTagList([]);
    setAddTagMode(false);
  };

  /**
   * Deletes a task order from the list
   * @param {Object} task -The task to be deleted
   */
  const handleTagDelete = (tag) =>{

    console.log(tag)

    return (deleteProjectTag({
      variables: {
        id: tag.id,
      },
    })
      .then(() => refetch())
      .catch((error) => { console.error(error)
        // setSnackbarState({
        //   open: true,
        //   message: (
        //     <span>
        //       There was a problem removing the task order. Error message:{" "}
        //       {error.message}
        //     </span>
        //   ),
        //   severity: "error",
        // });
      }))};

  return (
    <ApolloErrorHandler errors={error}>
      <Box component={"ul"} className={classes.chipContainer}>
        <Typography className={classes.fieldLabel}>Tags</Typography>
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
              className={classes}
              id="tag-autocomplete"
              // filterOptions={filterOptions}
              getOptionLabel={option => option.name}
              onChange={(e, value) => setNewTagList(value)}
              options={data.moped_tags}
              renderInput={params=> (
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
                onClick={() => console.log("save")}
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
    </ApolloErrorHandler>
  );
};

export default TagsSection;
