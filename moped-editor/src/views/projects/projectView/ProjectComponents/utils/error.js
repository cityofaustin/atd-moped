import { useReducer } from "react";

const errorMessageReducer = (state, action) => {
  switch (action.type) {
    case "show_error":
      return null;
    case "hide_error":
      return null;
    default:
      throw Error(`Unknown action. ${action.type}`);
  }
};
export const useToolbarErrorMessage = () => {
  const [errorToolbarState, errorToolbarDispatch] = useReducer(
    errorMessageReducer,
    {
      showError: false,
      message: false,
      severity: null,
    }
  );
};
