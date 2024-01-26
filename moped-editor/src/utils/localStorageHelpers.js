import { useState, useEffect } from "react";

/**
 * Get the user hidden column settings from local storage, clear them of
 * outdated columns, and supplement with remaining default columns
 * @param {Object} defaultColumnSettings - the baseline column visibility settings, where each entry
 * is a column name with a boolean value indicating if the column should be hidden
 * * @param {String} storageKey - the key used to get and set data from local storage
 * @returns {Object} hidden column settings from local storage
 */
const getPreviousHiddenColumns = (defaultColumnSettings, storageKey) => {
  let previousHiddenColumnSettings;

  try {
    previousHiddenColumnSettings = JSON.parse(localStorage.getItem(storageKey));
  } catch (e) {
    previousHiddenColumnSettings = null;
    console.error("Error parsing project list view hidden column settings", e);
  }

  let currentHiddenColumnSettings;

  // If there are no previous hidden column settings, set the default hidden columns
  if (!previousHiddenColumnSettings) {
    localStorage.setItem(storageKey, JSON.stringify(defaultColumnSettings));

    currentHiddenColumnSettings = defaultColumnSettings;
  } else {
    // Use previous settings to override default hidden columns.
    // By iterating the defaults, we also remove outdated columns no longer in config.
    currentHiddenColumnSettings = Object.keys(defaultColumnSettings).reduce(
      (acc, columnName) => {
        if (previousHiddenColumnSettings.hasOwnProperty(columnName)) {
          return {
            ...acc,
            [columnName]: previousHiddenColumnSettings[columnName],
          };
        } else {
          return { ...acc, [columnName]: defaultColumnSettings[columnName] };
        }
      },
      {}
    );
  }

  return currentHiddenColumnSettings;
};

export const useHiddenColumnsSettings = ({
  defaultHiddenColumnSettings,
  storageKey,
}) => {
  const [hiddenColumns, setHiddenColumns] = useState({});

  /*
   * Initialize hidden columns from previous local storage
   */
  useEffect(() => {
    const initialHiddenColumnSettings = getPreviousHiddenColumns(
      defaultHiddenColumnSettings,
      storageKey
    );

    console.log("initialHiddenColumnSettings", initialHiddenColumnSettings)
    setHiddenColumns(initialHiddenColumnSettings);
  }, [defaultHiddenColumnSettings, storageKey]);

  /*
   * Sync hidden columns state with local storage
   */
  useEffect(() => {
    console.log("EFFECTTTEEEED", hiddenColumns)
    localStorage.setItem(storageKey, JSON.stringify(hiddenColumns));
  }, [hiddenColumns]);

  return { hiddenColumns, setHiddenColumns };
};
