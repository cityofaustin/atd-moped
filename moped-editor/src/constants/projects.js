export const substantialCompletionDateTooltipText =
  "The earliest confirmed date of any Complete or Post-construction phase";

/**
 * Number of characters that falls below max set in the project and component description fields
 * sent to AGOL from component_arcgis_online_view database view
 * Names: project_description, component_description, component_location_description
 * See Field settings at https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2#data
 */
export const agolDescriptionCharacterMax = 5000;

// TODO: Should these all different limits
// Based of max char queries in prod:
// 2000 for project description
// 5000 for component description
// 500 for location description
