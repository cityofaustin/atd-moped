import DraftComponentListItem from "./DraftComponentListItem";

const DraftComponentList = ({
  createState,
  editState,
  onCancelComponentCreate,
  onCancelComponentMapEdit,
  doesDraftEditComponentHaveFeatures,
  onSaveDraftComponent,
  onSaveEditedComponent,
}) => {
  const shouldShowCreateListItem =
    createState.draftComponent && createState.isCreatingComponent;
  const shouldShowEditListItem =
    editState.draftEditComponent && editState.isEditingComponent;

  return (
    <>
      {shouldShowCreateListItem && (
        <DraftComponentListItem
          component={createState.draftComponent}
          onSave={onSaveDraftComponent}
          onCancel={onCancelComponentCreate}
          saveButtonDisabled={!createState.draftComponent?.features.length > 0}
          saveButtonText="Save"
        />
      )}
      {shouldShowEditListItem && (
        <DraftComponentListItem
          component={editState.draftEditComponent}
          onSave={onSaveEditedComponent}
          onCancel={onCancelComponentMapEdit}
          saveButtonDisabled={!doesDraftEditComponentHaveFeatures}
          saveButtonText="Save Edit"
        />
      )}
    </>
  );
};

export default DraftComponentList;
