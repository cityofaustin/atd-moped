import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import RelatedComponentListItem from "./RelatedComponentListItem";

const ComponentList = ({
  createState,
  editState,
  editDispatch,
  shouldShowRelatedProjects,
  clickedComponent,
  setClickedComponent,
  onCancelComponentCreate,
  onCancelComponentMapEdit,
  onClickZoomToComponent,
  allRelatedComponents,
  projectComponents,
  setIsDeletingComponent,
  doesDraftEditComponentHaveFeatures,
  onSaveDraftComponent,
  onSaveEditedComponent,
  setIsClickedComponentRelated,
  children,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;
  const shouldShowCreateListItem =
    createState.draftComponent && createState.isCreatingComponent;
  const shouldShowEditListItem =
    editState.draftEditComponent && editState.isEditingComponent;

  return (
    <List>
      {children}
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
      {isNotCreatingOrEditing &&
        projectComponents.map((component) => {
          const isExpanded =
            clickedComponent?.project_component_id ===
            component.project_component_id;
          return (
            <ComponentListItem
              key={component.project_component_id}
              component={component}
              isExpanded={isExpanded}
              setClickedComponent={setClickedComponent}
              setIsDeletingComponent={setIsDeletingComponent}
              editDispatch={editDispatch}
              onClickZoomToComponent={onClickZoomToComponent}
              isEditingComponent={editState.isEditingComponent}
              isCreatingComponent={createState.isCreatingComponent}
            />
          );
        })}
      {isNotCreatingOrEditing &&
        shouldShowRelatedProjects &&
        allRelatedComponents.map((component) => {
          const isExpanded =
            clickedComponent?.project_component_id ===
            component.project_component_id;
          return (
            <RelatedComponentListItem
              key={component.project_component_id}
              component={component}
              isExpanded={isExpanded}
              setClickedComponent={setClickedComponent}
              setIsDeletingComponent={setIsDeletingComponent}
              editDispatch={editDispatch}
              onClickZoomToComponent={onClickZoomToComponent}
              isEditingComponent={editState.isEditingComponent}
              isCreatingComponent={createState.isCreatingComponent}
              setIsClickedComponentRelated={setIsClickedComponentRelated}
            />
          );
        })}
    </List>
  );
};

export default ComponentList;
