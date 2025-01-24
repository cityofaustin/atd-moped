import { useMemo } from "react";
import * as yup from "yup";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";

export const IMPLEMENTATION_WORKGROUP_OPTIONS = [
  "Arterial Management",
  "Markings",
  "Signs",
  "Sidewalks & Special Projects",
  "General contractor",
  "Other",
];

const DEFAULT_ACTIVITY_VALUES = {
  status_id: 1, // "planned"
  task_orders: [],
};

export const activityValidationSchema = yup.object().shape({
  workgroup_contractor: yup
    .string()
    .max(500, "Must be less than 500 characters")
    .nullable(),
  contract_number: yup
    .string()
    .max(500, "Must be less than 500 characters")
    .nullable(),
  description: yup
    .string()
    .max(5000, "Must be less than 5,000 characters")
    .nullable(),
  work_assignment_id: yup
    .string()
    .max(500, "Must be less than 500 characters")
    .nullable(),
  contract_amount: yup.number().nullable(),
  status_id: yup.number().required(),
  status_note: yup
    .string()
    .max(5000, "Must be less than 5,000 characters")
    .nullable(),
  task_orders: yup.array().nullable(),
  id: yup.number().optional(),
  project_id: yup.number().required(),
  work_order_url: yup.string().url("Must be a valid link").nullable(),
});

/**
 * Parses an input string and saves an integer or null.
 * @param {string} value from form input
 * @param {object} field react-hook-form field object
 */
export const amountOnChangeHandler = (value, field) => {
  const handledValue = value
    ? removeNonIntegers(removeDecimalsAndTrailingNumbers(value))
    : null;
  field.onChange(handledValue);
};

/**
 * Extract task order data from select options or `null` if
 * no options are selected
 * @param {*} optionArray - array of task order options
 * @param {*} field - react-hook-form field object
 */
export const taskOrderOnChangeHandler = (optionArray, field) => {
  const taskOrders = optionArray?.map((o) => o.value);
  field.onChange(taskOrders?.length > 0 ? taskOrders : null);
};

export const isTaskOrderOptionEqualToValue = (option, selectedOption) => {
  return option.value.task_order === selectedOption.value.task_order;
};

/**
 * Create task order select options by assigning the tk object as the `value`
 * and the tk display name as the `label`
 */
export const useTaskOrderOptions = (taskOrderData) =>
  useMemo(() => {
    if (!taskOrderData) return [];
    return taskOrderData.map((tk) => ({ label: tk.display_name, value: tk }));
  }, [taskOrderData]);

/**
 * Only these fields will be included in the form submit payload
 */
const FORM_PAYLOAD_FIELDS = [
  "workgroup_contractor",
  "contract_number",
  "description",
  "work_assignment_id",
  "contract_amount",
  "status_id",
  "status_note",
  "task_orders",
  "work_order_url",
];

export const onSubmitActivity = ({
  data,
  mutate,
  onSubmitCallback,
  snackbarHandle,
  isNewActivity,
}) => {
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
  })
    .then((mutation) => onSubmitCallback({ mutation }))
    .catch((error) => {
      isNewActivity
        ? snackbarHandle(true, "Error adding work activity", "error", error)
        : snackbarHandle(true, "Error updating work activity", "error", error);
    });
};

export const useDefaultValues = (activity) =>
  useMemo(() => {
    if (activity.id) {
      return activity;
    } else return { ...activity, ...DEFAULT_ACTIVITY_VALUES };
  }, [activity]);
