import { createTheme } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

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
      secondary: "#848484",
      header: "#848484",
    },
    map: {
      transparent: "rgba(0,0,0,0)",
      trail: "#4caf50",
      draw: {
        activeLineVertices: "#7ac943",
        orange: "#fbb03b",
        blue: "#3bb2d0",
        gray: "#404040",
      },
      black: "#000",
      mutedGray: "#a6a2a2",
      pinkBright: "#fc0885",
      pinkLight: "#fc74ba",
      pinkDark: "#b5055f",
      bluePrimary: "#1276D1",
      blueDark: "#1069bc",
      blueLight: "#a1cdf7",
      steel: "#607d8f",
      white: "#fff",
      test: "#f28100",
    },
  },
  shadows,
  typography,
});

export default theme;
