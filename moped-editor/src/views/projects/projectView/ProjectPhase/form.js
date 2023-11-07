import * as yup from "yup";

export const phaseValidationSchema = yup.object().shape({
  phase_id: yup
    .number("Phase is required")
    .nullable()
    .required("Phase is required"),
  subphase_id: yup.number().nullable().optional(),
  phase_start: yup.string().nullable().optional(),
  phase_end: yup.string().nullable().optional(),
  is_current_phase: yup.boolean(),
  is_phase_start_confirmed: yup.boolean(),
  is_phase_end_confirmed: yup.boolean(),
  description: yup
    .string()
    .max(500, "Must be less than 500 characters")
    .nullable(),
  project_phase_id: yup.number().nullable().optional(),
  project_id: yup.number().required(),
});

/**
 * Only these fields will be included in the form submit payload
 */
const FORM_PAYLOAD_FIELDS = [];

export const onSubmitActivity = ({ data, mutate, onSubmitCallback }) => {
  const { id } = data;

  const payload = FORM_PAYLOAD_FIELDS.reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  const variables = { object: payload };

  if (id) {
    variables.id = id;
  } else {
    variables.object.project_id = data.project_id;
  }

  mutate({
    variables,
  }).then(() => onSubmitCallback());
};
