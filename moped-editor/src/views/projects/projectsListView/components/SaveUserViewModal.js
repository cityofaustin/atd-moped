import React, { useMemo } from "react";
import { useMutation } from "@apollo/client";
import FormDialog from "src/components/FormDialog";
import SaveUserViewForm from "./SaveUserViewForm";
import { useLocation } from "react-router-dom";
import { ADD_USER_SAVED_VIEW } from "src/queries/userSavedViews";

const SaveUserViewModal = ({
  showDialog,
  setIsSaveViewModalOpen,
  filters,
  filtersLabels,
  setIsViewSaved,
  handleSnackbar,
  searchTerm,
}) => {
  const [saveView, { loading }] = useMutation(ADD_USER_SAVED_VIEW);

  let { pathname, search } = useLocation();

  const defaultDescription = useMemo(() => {
    const filtersDescription = filtersLabels
      .map(
        (filter) =>
          `${filter.filterLabel} ${filter.operatorLabel} ${filter.filterValue}`
      )
      .join(", ");

    if (filtersDescription && searchTerm) {
      return `${searchTerm} with ${filtersDescription}`;
    }
    if (filtersDescription && !searchTerm) {
      return filtersDescription;
    }
    if (!filtersDescription && searchTerm) {
      return searchTerm;
    } else {
      return "";
    }
  }, [filtersLabels, searchTerm]);

  const onClose = () => {
    setIsSaveViewModalOpen(false);
  };

  // run save view mutation
  const onSaveViewClick = (formData) => {
    saveView({
      variables: {
        object: {
          description: formData.description,
          url: `${pathname}${search}`,
          query_filters: filters,
        },
      },
    })
      .then(() => {
        // close modal upon successful save
        onClose();
        setIsViewSaved(true);
        handleSnackbar(true, "View saved to Dashboard", "success");
      })
      .catch((error) => {
        handleSnackbar(true, "Error saving view to Dashboard", "error", error);
      });
  };

  return (
    <FormDialog
      title="Save view"
      dialogOpen={showDialog}
      handleClose={onClose}
      showDialogActions={false}
    >
      <SaveUserViewForm
        onSave={onSaveViewClick}
        description={defaultDescription}
        loading={loading}
      />
    </FormDialog>
  );
};

export default SaveUserViewModal;
