/**
 * Throws error to be displayed in the fallback component rendered through the ApolloErrorHandler component
 * @param {string} message - the error message to be displayed in the FallbackComponent
 * throws {Error} Error object intercepted by FallbackComponent
 */
export const throwFallbackComponentError = (message) => {
  throw Error(message);
};
