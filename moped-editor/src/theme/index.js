import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const theme = createMuiTheme({
  palette: {
    background: {
      dark: "#E1E2E1",
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: "#1e88e5",
    },
    secondary: {
      main: "#ff3d00",
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
    },
    map: {
      selected: "#00AAB1",
    },
  },
  shadows,
  typography,
});

export default theme;
