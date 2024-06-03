import { useReducer } from "react";

const errorMessageReducer = (state, action) => {
  switch (action.type) {
    case "show_error":
      const { message, severity, onClose, messageType } = action.payload;
      return { ...state, isOpen: true, message, severity, onClose, messageType };
    case "hide_component_error":
      if (state.messageType !== "componentLinkError") {
        return {...state}
      }
        return {
          isOpen: false,
          message: null,
          severity: null,
          onClose: null,
          messageType: null,
        };
    case "hide_zoom_error":
      if (state.messageType !== "componentZoomError") {
        // if zoom error not visible, do nothing
        return {...state}
      }
      return {
        isOpen: false,
        message: null,
        severity: null,
        onClose: null,
        messageType: null,
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
      onClose: null,
      messageType: null,
    }
  );

  return { errorMessageState, errorMessageDispatch };
};
