import { useState } from "react";
import {
  GridRowModes,
  GridActionsCellItem,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";

import { defaultEditColumnIconStyle } from "src/utils/dataGridHelpers";

/** Component for Data Grid table action buttons
 * @param {Number} id - Data Grid row id (same as project id)
 * @param {Array} requiredFields - fields that are required in order to save row
 * @param {Object} rowModesModel - row modes state from data grid
 * @param {Function} handleCancelClick - handles cancel button click
 * @param {Function} handleDeleteClick - handles delete button click
 * @param {Function} handleSaveClick - handles save button click
 * @param {Function} handleEditClick - handles edit button click, optional
 * @return {JSX.Element}
 */

const DataGridActions = ({
  id,
  requiredFields = [],
  rowModesModel,
  handleCancelClick,
  handleDeleteOpen,
  handleSaveClick,
  handleEditClick,
}) => {
  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const apiRef = useGridApiContext();

  const [hasRequiredFields, setHasRequiredFields] = useState(false);

  /**
   * To make our row re-render while still in edit mode we need the useGridSelector hook
   * which establishes a reactive binding with the grid state and allows us to enable the save button
   * if we have all the required fields.
   * For reference https://mui.com/x/react-data-grid/state/#access-the-state
   */
  useGridSelector(apiRef, () => {
    const editState = apiRef.current.state.editRows;
    const errors = [];

    for (const field of requiredFields) {
      const hasError = editState[id]?.[field]?.error;
      const changeReason = editState[id]?.[field]?.changeReason;

      // Only check for errors when cell value changes to keep save button disabled initially
      if (changeReason === "setEditCellValue") {
        errors.push(hasError);
      }
    }

    if (errors.length === requiredFields.length) {
      const hasAnyErrors = errors.some((error) => error === true);

      setHasRequiredFields(!hasAnyErrors);
    }
  });

  if (isInEditMode) {
    return [
      <GridActionsCellItem
        icon={<CheckIcon sx={defaultEditColumnIconStyle} />}
        label="Save"
        key="save"
        sx={{
          color: "primary.main",
        }}
        onClick={handleSaveClick(id)}
        disabled={!hasRequiredFields}
      />,
      <GridActionsCellItem
        icon={<CloseIcon sx={defaultEditColumnIconStyle} />}
        label="Cancel"
        key="cancel"
        className="textPrimary"
        onClick={handleCancelClick(id)}
        color="inherit"
      />,
    ];
  }
  return [
    // only render edit button if we were passed an edit handler and are not currently in edit mode
    handleEditClick && (
      <GridActionsCellItem
        icon={<EditOutlinedIcon sx={defaultEditColumnIconStyle} />}
        label="Edit"
        key="edit"
        className="textPrimary"
        onClick={handleEditClick(id)}
        color="inherit"
      />
    ),
    <GridActionsCellItem
      icon={<DeleteOutlineIcon sx={defaultEditColumnIconStyle} />}
      label="Delete"
      key="delete"
      onClick={handleDeleteOpen(id)}
      color="inherit"
    />,
  ];
};

export default DataGridActions;
