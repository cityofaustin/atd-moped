import OverrideFundingForm, {
  type OverrideFundingFormProps,
} from "src/views/projects/projectView/ProjectFunding/OverrideFundingForm";
import FormDialog from "src/components/FormDialog";

const OverrideFundingDialog = ({
  handleClose,
  fundingRecord,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  projectId,
  dataLookups,
}: OverrideFundingFormProps) => {
  return (
    // @ts-expect-error Migrating FormDialog to TS captured in #30535
    <FormDialog
      title={`Override eCAPRIS FDU ${fundingRecord.fdu?.fdu ?? ""}`}
      open={true}
      handleClose={handleClose}
    >
      <OverrideFundingForm
        fundingRecord={fundingRecord}
        handleSnackbar={handleSnackbar}
        refetchFundingQuery={refetchFundingQuery}
        setOverrideFundingRecord={setOverrideFundingRecord}
        projectId={projectId}
        handleClose={handleClose}
        dataLookups={dataLookups}
      />
    </FormDialog>
  );
};

export default OverrideFundingDialog;
