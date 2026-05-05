import OverrideFundingForm from "src/views/projects/projectView/ProjectFunding/OverrideFundingForm";
import FormDialog from "src/components/FormDialog";

const OverrideFundingDialog = ({
  handleClose,
  fundingRecord,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  projectId,
  dataProjectFunding,
}) => {
  return (
    <FormDialog
      title={`Edit eCAPRIS FDU ${fundingRecord.fdu.fdu}`}
      dialogOpen={true}
      handleClose={handleClose}
      showDialogActions={false}
    >
      <OverrideFundingForm
        fundingRecord={fundingRecord}
        handleSnackbar={handleSnackbar}
        refetchFundingQuery={refetchFundingQuery}
        setOverrideFundingRecord={setOverrideFundingRecord}
        projectId={projectId}
        handleClose={handleClose}
        dataProjectFunding={dataProjectFunding}
      />
    </FormDialog>
  );
};

export default OverrideFundingDialog;
