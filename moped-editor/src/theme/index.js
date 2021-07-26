import { createMuiTheme } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const theme = createMuiTheme({
  palette: {
    background: {
      dark: "#E1E2E1",
      default: "#edeeed",
      paper: "#ffffff",
      mapControls: "#FFFFFF",
      mapControlsHover: "#e6e6e6",
    },
    primary: {
      main: "#1e88e5",
      dark: "#005cb2",
      light: "#61b5ff",
    },
    secondary: {
      main: "#ff6549",
    },
    text: {
      primary: "#212121",
      secondary: "#848484",
    },
    map: {
      transparent: "rgba(0,0,0,0)",
      trail: "#4caf50",
    },
  },
  shadows,
  typography,
});

export default theme;
