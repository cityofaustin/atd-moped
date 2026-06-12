/* Mapbox GL Draw modes that we use to determine isDrawing state. */
export const isDrawingModes = ["draw_point", "draw_line_string"];

/**
 * Check if the draw tools are active and in a drawing mode
 * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#modes
 * @param {String} mode - the current Mapbox GL Draw mode
 * @returns {Boolean} - true if we are in the tools are active
 */
export const isInDrawingMode = (mode) => isDrawingModes.includes(mode);
