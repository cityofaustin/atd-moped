import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import ProjectStatusBadgeFake from "./ProjectStatusBadgeFake";
import ProjectName from "./ProjectName";
import { useNavigate, useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function ComponentMapToolbar({
  isFetchingFeatures,
  projectName,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar style={{ backgroundColor: "#fff" }}>
        <Box mr={2}>
          <ProjectName name={projectName} id={projectId} />
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
