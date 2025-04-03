import * as yup from "yup";

export const substantialCompletionDateTooltipText =
  "The earliest confirmed date of any Complete or Post-construction phase";

/**
 * Number of string characters that equal the maximum set in AGOL feature service that
 * receives data from the component_arcgis_online_view database view.
 * See Field settings at https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2#data
 */
export const agolFieldCharMax = {
  string: 2000,
  descriptionString: 10000,
  projectNameFull: 1000,
};

/**
 * This maximum considers the total number of characters allowed in the project full name
 * field in the component_arcgis_online_view feature service. This schema splits that limit in half
 * to allow equal space for the primary and secondary name fields that make up the full name.
 */
export const projectNamesCharMax = agolFieldCharMax.projectNameFull / 2;

/**
 * Reusable validation schema for fields with multiple inputs in different app views.
 */
export const agolValidation = {
  description: yup
    .string()
    .trim()
    .max(
      agolFieldCharMax.descriptionString,
      `Description must be ${agolFieldCharMax.descriptionString} characters or less`
    )
    .nullable()
    .required("Required"),
  /* Name is intentionally nullable and required to support our ControlledTextInput
  that coerces empty strings to be null */
  projectName: yup
    .string()
    .trim()
    .max(
      projectNamesCharMax,
      `Name must be ${projectNamesCharMax} characters or less`
    )
    .nullable()
    .required("Name cannot be blank"),
  projectSecondaryName: yup
    .string()
    .trim()
    .max(
      projectNamesCharMax,
      `Secondary name must be ${projectNamesCharMax} characters or less`
    )
    .nullable(),
  projectStatusUpdate: yup
    .string()
    .max(
      agolFieldCharMax.string,
      `Status update must be ${agolFieldCharMax.string} characters or less`
    )
    .nullable(),
};
