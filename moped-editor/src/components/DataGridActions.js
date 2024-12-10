import {
  GridRowModes,
  GridActionsCellItem,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";

import { defaultEditColumnIconStyle } from "src/utils/dataGridHelpers";

const DataGridActions = ({
  id,
  requiredField,
  rowModesModel,
  handleCancelClick,
  handleDeleteOpen,
  handleSaveClick,
}) => {
  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const apiRef = useGridApiContext();

  const hasRequiredField = useGridSelector(apiRef, () => {
    const editState = apiRef.current.state.editRows;
    return !!editState[id]?.[requiredField]?.value;
  });
  if (isInEditMode) {
    return [
      <GridActionsCellItem
        icon={<CheckIcon sx={defaultEditColumnIconStyle} />}
        label="Save"
        sx={{
          color: "primary.main",
        }}
        onClick={handleSaveClick(id)}
        disabled={!hasRequiredField}
      />,
      <GridActionsCellItem
        icon={<CloseIcon sx={defaultEditColumnIconStyle} />}
        label="Cancel"
        className="textPrimary"
        onClick={handleCancelClick(id)}
        color="inherit"
      />,
    ];
  }
  return [
    <GridActionsCellItem
      icon={<DeleteOutlineIcon sx={defaultEditColumnIconStyle} />}
      label="Delete"
      onClick={() => handleDeleteOpen(id)}
      color="inherit"
    />,
  ];
};

export default DataGridActions;
