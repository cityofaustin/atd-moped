import { useMemo } from "react";
import * as yup from "yup";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
  INT_4_MAX,
  outOfRangeErrorMessage,
} from "src/utils/numberFormatters";
import { getExternalLinkText } from "src/utils/urls";

export const IMPLEMENTATION_WORKGROUP_OPTIONS = [
  "Arterial Management",
  "Markings",
  "Signs",
  "Sidewalks and Urban Trails",
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
  contract_amount: yup
    .number()
    .max(INT_4_MAX, outOfRangeErrorMessage)
    .nullable(),
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
  const integerValue = value
    ? removeNonIntegers(removeDecimalsAndTrailingNumbers(value))
    : null;
  // if after removing non integers, we are only left we an empty string, handle as null
  const handledValue = integerValue ? integerValue : null;
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
];

const createFileMutationPayload = (workOrderUrl, data, isNewActivity) => {
  const fileDetails = {
    project_id: data.project_id,
    file_name: getExternalLinkText(data.work_order_url) ?? "Work order link",
    file_type: 5,
    file_size: 0,
    file_url: workOrderUrl,
  };

  if (isNewActivity) {
    return {
      moped_project_file: {
        data: fileDetails,
      },
    };
  } else {
    return {
      ...fileDetails,
      files_project_work_activities: {
        data: {
          entity_id: data.id,
        },
      },
    };
  }
};

export const onSubmitActivity = ({
  data,
  mutate,
  onSubmitCallback,
  handleSnackbar,
  isNewActivity,
}) => {
  const { id } = data;
  const workOrderUrl = data.work_order_url;

  const payload = FORM_PAYLOAD_FIELDS.reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  const filePayload = workOrderUrl
    ? createFileMutationPayload(workOrderUrl, data, isNewActivity)
    : {};

  console.log(filePayload);

  const variables = { object: payload };

  // if there is an id, this is an update mutation, otherwise its an add mutation
  if (id) {
    variables.id = id;
    variables.fileObjects = [filePayload];
  } else {
    variables.object.project_id = data.project_id;
    if (workOrderUrl) {
      variables.object["work_activity_files"] = { data: [filePayload] };
    }
  }

  console.log(variables);

  mutate({
    variables,
  })
    .then((mutation) => onSubmitCallback({ mutation }))
    .catch((error) => {
      if (isNewActivity) {
        handleSnackbar(true, "Error adding work activity", "error", error);
      } else {
        handleSnackbar(true, "Error updating work activity", "error", error);
      }
    });
};

export const useDefaultValues = (activity) =>
  useMemo(() => {
    if (activity.id) {
      return activity;
    } else return { ...activity, ...DEFAULT_ACTIVITY_VALUES };
  }, [activity]);
