/**
 * Wrapper function for Yup.validateSync that returns formatted errors
 * See https://github.com/jquense/yup?tab=readme-ov-file#schemavalidatesyncvalue-any-options-object-infertypeschema
 * @param {object} value - Key-value pairs of the fields to validate
 * @param {object} yupValidationSchema - The Yup validation schema to use
 * @returns {object|null} - Returns an object with errors or null if no errors
 */
export const yupValidator = (value, yupValidationSchema) => {
  try {
    yupValidationSchema.validateSync(value, { abortEarly: false });
    return null;
  } catch (yupError) {
    // Collect the fields and error messages from the Yup error object
    const errorMessages = {};
    if (yupError.inner) {
      yupError.inner.forEach((err) => {
        errorMessages[err.path] = err.message;
      });
    }

    return errorMessages;
  }
};
