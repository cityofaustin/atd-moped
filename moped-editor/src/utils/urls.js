import * as yup from "yup";

export const isValidUrl = (url) => {
  return yup.string().url().isValidSync(url);
};
