import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import ProjectStatusBadge from "../ProjectStatusBadge";
import ProjectName from "./ProjectName";
import MapAlert from "./MapAlert";
import { useNavigate, useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function ComponentMapToolbar({
  isFetchingFeatures,
  projectName,
  projectStatuses,
  errorMessageState,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { message, severity, isOpen } = errorMessageState;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar style={{ backgroundColor: "#fff" }}>
        <Box mr={2}>
          <ProjectName name={projectName} id={projectId} />
        </Box>
        <Box mr={2}>
          <ProjectStatusBadge
            phase="Construction"
            status={1}
            projectStatuses={projectStatuses}
            condensed
          />
          <MapAlert message={message} severity={severity} isOpen={isOpen} />
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
            onClick={() => {
              navigate(`/moped/projects/${projectId}?tab=summary`);
            }}
          >
            Close map
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
