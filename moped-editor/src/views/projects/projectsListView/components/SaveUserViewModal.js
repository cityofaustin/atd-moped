import React from "react";
import { useMutation } from "@apollo/client";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

  const getDefaultDescription = () => {
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
  };

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
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        Save view
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <SaveUserViewForm
          onSave={onSaveViewClick}
          description={() => getDefaultDescription()}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SaveUserViewModal;
