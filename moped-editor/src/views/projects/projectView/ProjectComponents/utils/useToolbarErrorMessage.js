import { useReducer } from "react";

const errorMessageReducer = (state, action) => {
  switch (action.type) {
    case "show_error":
      const { message, severity } = action.payload;
      return { ...state, isOpen: true, message, severity };
    case "hide_error":
      return {
        isOpen: false,
        message: null,
        severity: null,
      };
    default:
      throw Error(`Unknown action. ${action.type}`);
  }
};
export const useToolbarErrorMessage = () => {
  const [errorMessageState, errorMessageDispatch] = useReducer(
    errorMessageReducer,
    {
      isOpen: false,
      message: null,
      severity: null,
    }
  );

  return { errorMessageState, errorMessageDispatch };
};
