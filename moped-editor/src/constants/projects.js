export const substantialCompletionDateTooltipText =
  "The earliest confirmed date of any Complete or Post-construction phase";

/**
 * Number of string characters that fall below maximum set in fields sent to AGOL from
 * component_arcgis_online_view database view.
 * Key example: component_location_description (AGOL) -> componentLocationDescription
 * See Field settings at https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2#data
 */
export const agolFieldCharMax = {
  projectDescription: 2000,
  componentDescription: 5000,
  componentLocationDescription: 500,
};
