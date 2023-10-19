import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import ProjectStatusBadge from "../ProjectStatusBadge";
import ProjectName from "./ProjectName";
import MapAlert from "./MapAlert";
import { useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbarContainer: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ComponentMapToolbar({
  isFetchingFeatures,
  projectName,
  phaseKey,
  phaseName,
  errorMessageState,
  onCloseTab,
}) {
  const classes = useStyles();
  const { projectId } = useParams();
  const { message, severity, isOpen, onClose } = errorMessageState;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbarContainer}>
        <Box mr={2}>
          <ProjectName name={projectName} id={projectId} />
        </Box>
        <Box mr={2}>
          <ProjectStatusBadge
            phaseKey={phaseKey}
            phaseName={phaseName}
            condensed
          />
        </Box>
        <Box mr={2}>
          <MapAlert
            message={message}
            severity={severity}
            isOpen={isOpen}
            onClose={onClose ? onClose : null}
          />
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
            onClick={onCloseTab}
          >
            Close map
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
