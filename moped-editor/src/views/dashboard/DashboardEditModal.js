import React, {useState} from "react";
import {
  Typography,
  Popper,
  Paper
} from "@material-ui/core";


const DashboardEditModal = ({displayText}) => {
  const divRef = React.useRef();

  // anchor element for dashboard edit modal to "attach" to
  const [dashboardEditAnchor, setDashboardEditAnchor] = useState(null);

  const handleDashboardEditClose = () => {
    setDashboardEditAnchor(null);
  };

  console.log(displayText)
  return (
    <>
    <Typography onClick={()=>setDashboardEditAnchor(divRef.current)}>
      {displayText} HIHIHI
    </Typography>
    <Popper
        id="DashboardEditModal"
        open={Boolean(dashboardEditAnchor)}
        anchorEl={dashboardEditAnchor}
        onClose={handleDashboardEditClose}
        placement={"bottom"}
        // className={classes.advancedSearchRoot}
      >
        <Paper> {//className={classes.advancedSearchPaper}>
      }
          "EDIT"
        </Paper>
      </Popper>
    </>
  );
}

export default DashboardEditModal;
