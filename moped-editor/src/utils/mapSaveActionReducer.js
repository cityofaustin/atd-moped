/* Save Action State Reducer */
export const mapSaveActionInitialState = () => ({
  currentStep: 0,
  initiateFeatureSave: false, // Tells the map to save all features
  featuresSaved: false, // Tells the component editor to save the component
  componentSaved: false, // Tells the world the component is saved
  exit: false, // Tells the world it's time to exit
  errors: null,
  message: null,
});

/**
 * Handles events across different components using a reducer
 * @param state - The current state
 * @param action - The action (signal) being received
 * @return {Object} - The new state
 */
export const mapSaveActionReducer = (state, action) => {
  if (!state) return;

  // If we have an error and not reset action, ignore updating the state
  if (
    !!state?.currentStep &&
    state.currentStep === -1 &&
    action.type !== "reset"
  )
    return;

  // We are clear to test the action
  switch (action.type) {
    case "initiateFeatureSave": {
      // If already initialized, ignore update
      if (state.initiateFeatureSave) return;
      return {
        ...state,
        currentStep: state.currentStep + 1, // 1
        initiateFeatureSave: true,
      };
    }
    case "featuresSaved": {
      // If already saved features, ignore update
      if (state.featuresSaved) return;
      return {
        ...state,
        currentStep: state.currentStep + 1, // 2
        featuresSaved: true,
      };
    }
    case "componentSaved": {
      // If already saved component, ignore update
      if (state.componentSaved) return;
      return {
        ...state,
        currentStep: state.currentStep + 1, // 3
        componentSaved: true,
      };
    }
    case "exit": {
      // If already exited, ignore update
      if (state.exit) return;
      return {
        ...state,
        currentStep: state.currentStep + 1, // 4
        exit: true,
      };
    }
    case "error": {
      return {
        ...state,
        errors: true,
        currentStep: -1, // Error
        message: action?.message,
      };
    }
    case "reset":
      return mapSaveActionInitialState();
    default: {
      throw new Error(`Invalid action: ${action?.type}`);
    }
  }
};
