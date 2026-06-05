import ProjectWorkActivitiesForm from "./ProjectWorkActivityForm";
import FormDialog from "src/components/FormDialog";

const ProjectWorkActivitiesDialog = ({
  onClose,
  activity,
  onSubmitCallback,
  handleSnackbar,
}) => {
  const titleText = activity.id ? "Edit work activity" : "Add work activity";
  return (
    <FormDialog title={titleText} handleClose={onClose} open={true}>
      <ProjectWorkActivitiesForm
        activity={activity}
        onSubmitCallback={onSubmitCallback}
        handleSnackbar={handleSnackbar}
      />
    </FormDialog>
  );
};

export default ProjectWorkActivitiesDialog;
