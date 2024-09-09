import React, { useEffect } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { Autocomplete, Alert } from "@mui/material";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  getSchoolZoneBeaconOptionLabel,
  getSchoolZoneBeaconOptionSelected,
  SOCRATA_ENDPOINT_SCHOOL_BEACONS,
} from "src/utils/signalComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset and setting it as a project component.
 * @param {Object} classes - MaterialUI style object
 * @param {Function} onChange - callback function to run when the signal is changed for React Hook Form
 * @param {Object} value - the signal feature to set as the value of the autocomplete from React Hook Form
 * @param {Function} onOptionsLoaded - callback function to run when the options are loaded
 * @param {String} signalType - School Zone Beacon
 * @return {JSX.Element}
 */
const SchoolZoneBeaconComponentAutocomplete = React.forwardRef(
  ({ classes, onChange, value, onOptionsLoaded }, ref) => {
    const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT_SCHOOL_BEACONS);

    // Let the parent component know that the options are ready to go
    useEffect(() => {
      if (features === null) return;

      onOptionsLoaded && onOptionsLoaded();
    }, [features, onOptionsLoaded]);

    if (loading) {
      return <CircularProgress color="primary" size={20} />;
    } else if (error) {
      return (
        <Alert severity="error">{`Unable to load school zone beacon list: ${error}`}</Alert>
      );
    }

    return (
      <Autocomplete
        className={classes}
        id="school-zone-beacon-id"
        filterOptions={filterOptions}
        isOptionEqualToValue={getSchoolZoneBeaconOptionSelected}
        // this label formatting mirrors the Data Tracker formatting
        getOptionLabel={getSchoolZoneBeaconOptionLabel}
        onChange={(_event, option) => onChange(option)}
        loading={loading}
        options={features}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            error={error}
            InputLabelProps={{ required: false }}
            label="School Zone Beacon"
            variant="outlined"
            size="small"
          />
        )}
        value={value}
      />
    );
  }
);

export default SchoolZoneBeaconComponentAutocomplete;
