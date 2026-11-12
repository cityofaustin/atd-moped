import { createTheme } from "@mui/material";
import shadows from "./shadows";
import typography from "./typography";

const baseColors = {
  black: "#000",
  white: "#fff",
  textPrimary: "#212121",
  textSecondary: "#666666",
  primary: {
    main: "#1276D1",
    dark: "#005cb2",
    light: "#55ACF8",
  },
};

export const phaseColors = {
  default: "#e0e0e0",
  warning: "#ffb74d",
  success: "#81c784",
  info: "#4fc3f7",
  error: "#e57373",
  potentialAndOnHold: "#9e9e9e",
};

const mapColors = {
  black: baseColors.black,
  white: baseColors.white,
  grey: phaseColors.default,
  mutedGray: "#a6a2a2",
  pinkBright: "#fc0885",
  pinkLight: "#fc74ba",
  pinkDark: "#b5055f",
  bluePrimary: baseColors.primary.main,
  blueDark: "#1069bc",
  blueLight: "#a1cdf7",
  steel: "#607d8f",
  orange: "#ffb300",
  lightOrange: "#ffc94a",
  green: "#4caf50",
  greenLight: "#80e27e",
  draw: {
    activeLineVertices: "#7ac943",
    orange: "#fbb03b",
    blue: "#3bb2d0",
    gray: "#404040",
  },
};

export const globalStyles = {
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  html: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    height: "100%",
    width: "100%",
  },
  body: {
    backgroundColor: "#f4f6f8",
    height: "100%",
    width: "100%",
  },
  a: {
    textDecoration: "none",
  },
  "#root": {
    height: "100%",
    width: "100%",
  },
};

const theme = createTheme({
  palette: {
    background: {
      default: "#edeeed",
      paper: baseColors.white,
      mapControls: baseColors.white,
      mapControlsHover: "#e6e6e6",
      summaryHover: "#f2f2f2",
    },
    primary: baseColors.primary,
    secondary: {
      main: "#ff6549",
    },
    error: {
      light: phaseColors.error,
      main: "#f44336",
      dark: "#d32f2f",
    },
    text: {
      primary: baseColors.textPrimary,
      secondary: baseColors.textSecondary,
    },
    phase: phaseColors,
    map: {
      ...mapColors,
      transparent: "rgba(0,0,0,0)",
    },
  },
  shadows,
  typography,
  overrides: {
    MuiInputBase: {
      input: {
        "&::placeholder": {
          color: "#666666",
          opacity: 1,
        },
      },
    },
  },
});

export default theme;
