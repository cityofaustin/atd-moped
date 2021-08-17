import { createMuiTheme } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#edeeed",
      paper: "#ffffff",
      mapControls: "#FFFFFF",
      mapControlsHover: "#e6e6e6",
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
    },
  },
  shadows,
  typography,
});

export default theme;
