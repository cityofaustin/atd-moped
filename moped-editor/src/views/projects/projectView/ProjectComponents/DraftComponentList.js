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
          primaryText={createState.draftComponent.component_name}
          secondaryText={createState.draftComponent.component_subtype}
          onSave={onSaveDraftComponent}
          onCancel={onCancelComponentCreate}
          saveButtonDisabled={!createState.draftComponent?.features.length > 0}
          saveButtonText="Save"
        />
      )}
      {shouldShowEditListItem && (
        <DraftComponentListItem
          primaryText={
            editState.draftEditComponent?.moped_components?.component_name
          }
          secondaryText={
            editState.draftEditComponent?.moped_components?.component_subtype
          }
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
