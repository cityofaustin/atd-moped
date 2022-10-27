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
      summaryHover: "#f2f2f2"
    },
    primary: {
      main: "#1276D1",
      dark: "#005cb2",
      light: "#55ACF8",
    },
    secondary: {
      main: "#ff6549",
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
    },
  },
  shadows,
  typography,
});

export default theme;
