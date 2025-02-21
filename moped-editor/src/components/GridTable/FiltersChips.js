import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Box, Typography, Chip, Grid, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {
  advancedSearchFilterParamName,
  advancedSearchIsOrParamName,
} from "src/views/projects/projectsListView/useProjectListViewQuery/useAdvancedSearch";
import { formatDateType } from "src/utils/dateAndTime";
import { FILTERS_COMMON_OPERATORS } from "./FiltersCommonOperators";
import { ADD_USER_SAVED_VIEW } from "src/queries/project";

const useStyles = makeStyles((theme) => ({
  filtersList: {
    paddingTop: theme.spacing(1),
    display: "flex",
    alignItems: "start",
  },
  filtersText: {
    fontFamily: "Roboto",
    fontSize: ".9rem",
    color: theme.palette.text.secondary,
  },
  saveViewButton: {
    margin: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
}));

/**
 * Renders filters applied in advanced search
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @param {Array|Objects} filters - applied filters
 * @param {Boolean} isOr - true if ANY filters are matched, false if ALL
 * @return {JSX.Element}
 * @constructor
 */
const FiltersChips = ({
  filters,
  setFilters,
  isOr,
  filtersConfig,
  setSearchParams,
  setIsOr,
  handleSnackbar
}) => {
  const classes = useStyles();

  const [saveView] = useMutation(ADD_USER_SAVED_VIEW);
  const [IsViewSaved, setIsViewSaved] = useState(false);

  let { pathname, search } = useLocation();

  const filtersCount = Object.keys(filters).length;

  const filtersLabels = filters.map((filter) => {
    const fieldFilterConfig = filtersConfig[filter.field];
    const fieldOperatorConfig = FILTERS_COMMON_OPERATORS[filter.operator];
    const isDateType = fieldFilterConfig.type === "date";
    return {
      filterLabel: fieldFilterConfig?.label,
      operatorLabel: fieldOperatorConfig?.label,
      filterValue:
        isDateType && filter.value
          ? formatDateType(filter.value)
          : filter.value,
    };
  });

  /**
   * Triggered by Filter Chip delete click
   * Removes specified filter from state and update the url params
   * @param {number} filterIndex - The index of the filter to be deleted
   */
  const handleDeleteButtonClick = (filterIndex) => {
    const filtersNewState = [...filters];
    filtersNewState.splice(filterIndex, 1);
    setFilters(filtersNewState);

    const remainingFiltersCount = filtersNewState.length;

    if (remainingFiltersCount === 1) {
      // Reset isOr to false (all/and) if there is only one filter left
      setIsOr(false);
      // update params as well
      setSearchParams((prevSearchParams) => {
        prevSearchParams.set(advancedSearchIsOrParamName, false);
        return prevSearchParams;
      });
    }

    // Update search params in url
    if (remainingFiltersCount > 0) {
      setSearchParams((prevSearchParams) => {
        const jsonParamString = JSON.stringify(filtersNewState);
        prevSearchParams.set(advancedSearchFilterParamName, jsonParamString);
        return prevSearchParams;
      });
      setIsViewSaved(false);
    } else {
      // no filters left, clear search params
      setSearchParams((prevSearchParams) => {
        prevSearchParams.delete(advancedSearchFilterParamName);
        prevSearchParams.delete(advancedSearchIsOrParamName);

        return prevSearchParams;
      });
    }
  };

  /**
   * Triggered by Filter Chip any/all click
   * Sets the IsOr state and the url params state to be the opposite of current isOr state
   */
  const toggleIsOrOnClick = () => {
    setIsOr(!isOr);
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set(advancedSearchIsOrParamName, !isOr);
      return prevSearchParams;
    });
    setIsViewSaved(false);
  };

  const handleSaveView = () => {
    const defaultDescription = filtersLabels
      .map(
        (filter) =>
          `${filter.filterLabel} ${filter.operatorLabel} ${filter.filterValue}`
      )
      .join(", ");
    saveView({
      variables: {
        object: {
          description: defaultDescription,
          url: `${pathname}${search}`,
          query_filters: filters,
        },
      },
    })
      .then(() => {
        setIsViewSaved(true);
        handleSnackbar(true, "View saved to Dashboard", "success");
      })
      .catch((error) => {
        handleSnackbar(true, "Error saving view to Dashboard", "error", error);
      });
  };

  return (
    <Box className={classes.filtersList}>
      <Typography className={classes.filtersText} component="span">
        <Grid container alignItems={"center"} spacing={0.5}>
          <Grid>
            <Button
              onClick={() => {
                handleSaveView();
              }}
              variant="outlined"
              color="primary"
              className={classes.saveViewButton}
              disabled={IsViewSaved}
            >
              SAVE VIEW
            </Button>
          </Grid>
          {filtersCount > 1 && (
            <Grid item>
              <Chip
                variant="outlined"
                color="primary"
                onClick={toggleIsOrOnClick}
                label={
                  isOr ? (
                    <>
                      Matching
                      <span style={{ fontWeight: 600 }}> any </span> filter
                    </>
                  ) : (
                    <>
                      Matching
                      <span style={{ fontWeight: 600 }}> all </span> filters
                    </>
                  )
                }
              />
            </Grid>
          )}
          {filtersLabels.map((filter, index) => (
            <Grid item key={index}>
              <Chip
                onDelete={() => handleDeleteButtonClick(index)}
                label={
                  <>
                    <span style={{ fontWeight: 600 }}>
                      {filter.filterLabel}
                    </span>{" "}
                    {filter.operatorLabel} {filter.filterValue}
                  </>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Box>
  );
};

export default FiltersChips;
