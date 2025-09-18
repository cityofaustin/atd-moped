import { createTheme } from "@mui/material";
import shadows from "./shadows";
import typography from "./typography";

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
      paper: "#ffffff",
      mapControls: "#FFFFFF",
      mapControlsHover: "#e6e6e6",
      summaryHover: "#f2f2f2",
    },
    primary: {
      main: "#1276D1",
      dark: "#005cb2",
      light: "#55ACF8",
    },
    secondary: {
      main: "#ff6549",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
    },
    text: {
      primary: "#212121",
      secondary: "#666666",
    },
    map: {
      transparent: "rgba(0,0,0,0)",
      green: "#4caf50",
      greenLight: "#80e27e",
      draw: {
        activeLineVertices: "#7ac943",
        orange: "#fbb03b",
        blue: "#3bb2d0",
        gray: "#404040",
      },
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
