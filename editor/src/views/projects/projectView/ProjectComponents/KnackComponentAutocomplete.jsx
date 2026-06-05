import React, { useEffect, useMemo } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { Autocomplete, Alert } from "@mui/material";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset and setting it as a project component.
 * @param {Object} classes - MaterialUI style object
 * @param {Function} onChange - callback function to run when the signal is changed for React Hook Form
 * @param {Object} value - the signal feature to set as the value of the autocomplete from React Hook Form
 * @param {Function} onOptionsLoaded - callback function to run when the options are loaded
 * @param {String} signalType - either PHB, TRAFFIC or null
 * @param {String} socrataEndpoint -
 * @param {Function} isOptionEqualToValue -
 * @param {Function} getOptionLabel -
 * @param {String} componentLabel -
 * @return {JSX.Element}
 */
const KnackComponentAutocomplete = React.forwardRef(
  (
    {
      classes,
      onChange,
      value,
      onOptionsLoaded,
      signalType,
      socrataEndpoint,
      isOptionEqualToValue,
      getOptionLabel,
      componentLabel,
      textInputOptions = {},
    },
    ref
  ) => {
    const { features, loading, error } = useSocrataGeojson(socrataEndpoint);

    // Filter returned results to the signal type chosen - PHB or TRAFFIC
    // unless school beacons, then return all features
    const featuresFilteredByType = useMemo(
      () =>
        signalType
          ? features?.filter(
              (feature) =>
                feature.properties.signal_type.toLowerCase() ===
                signalType.toLowerCase()
            )
          : features,
      [features, signalType]
    );

    // Let the parent component know that the options are ready to go
    useEffect(() => {
      if (features === null) return;

      onOptionsLoaded && onOptionsLoaded();
    }, [features, onOptionsLoaded]);

    if (loading) {
      return <CircularProgress color="primary" size={20} />;
    } else if (error) {
      return (
        <Alert severity="error">{`Unable to load ${componentLabel} list: ${error}`}</Alert>
      );
    }

    return (
      <Autocomplete
        className={classes}
        id="knack-component-autocomplete"
        filterOptions={filterOptions}
        isOptionEqualToValue={isOptionEqualToValue}
        // this label formatting mirrors the Data Tracker formatting
        getOptionLabel={getOptionLabel}
        onChange={(_event, option) => onChange(option)}
        loading={loading}
        options={featuresFilteredByType}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            error={error}
            InputLabelProps={{ required: false }}
            label={componentLabel}
            variant="outlined"
            size="small"
            {...textInputOptions}
          />
        )}
        value={value}
      />
    );
  }
);

export default KnackComponentAutocomplete;
