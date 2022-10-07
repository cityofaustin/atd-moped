import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import ProjectStatusBadgeFake from "./ProjectStatusBadgeFake";
import ProjectName from "./ProjectName";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function ComponentMapToolbar({ isFetchingFeatures }) {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar style={{ backgroundColor: "#fff" }}>
        <Box mr={2}>
          <ProjectName name="John's Latest Project" id={456} />
        </Box>
        <Box mr={2}>
          <ProjectStatusBadgeFake phase="Construction" status={1} condensed />
        </Box>
        <Box color="primary" display="flex" flexGrow={1}>
          {isFetchingFeatures && <CircularProgress />}
        </Box>
        <Box>
          <Button
            size="small"
            color="primary"
            fullWidth
            endIcon={<CloseIcon />}
            onClick={() =>
              alert(
                "This button returns you to the previous page you visted. Defaults to sumamry tab."
              )
            }
          >
            Close map
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
