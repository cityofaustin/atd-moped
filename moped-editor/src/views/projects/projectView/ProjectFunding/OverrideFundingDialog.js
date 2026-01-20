import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import OverrideFundingForm from "src/views/projects/projectView/ProjectFunding/OverrideFundingForm";

const OverrideFundingDialog = ({
  onClose,
  fundingRecord,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  projectId,
}) => {
  return (
    <Dialog open onClose={onClose} fullWidth scroll="body">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        <span>{`Override eCAPRIS FDU ${fundingRecord?.fdu?.fdu}`}</span>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <OverrideFundingForm
          fundingRecord={fundingRecord}
          handleSnackbar={handleSnackbar}
          refetchFundingQuery={refetchFundingQuery}
          setOverrideFundingRecord={setOverrideFundingRecord}
          projectId={projectId}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OverrideFundingDialog;
