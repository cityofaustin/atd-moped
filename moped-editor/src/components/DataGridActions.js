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

const DataGridActions = ({
  id,
  requiredFields,
  rowModesModel,
  handleCancelClick,
  handleDeleteOpen,
  handleSaveClick,
  handleEditClick,
}) => {
  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const apiRef = useGridApiContext();

  const hasRequiredFields = useGridSelector(apiRef, () => {
    const editState = apiRef.current.state.editRows;
    for (const field of requiredFields) {
      if (!editState[id]?.[field]?.value) {
        return false;
      }
    }
    return true;
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
        disabled={!hasRequiredFields}
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
    handleEditClick && (
      <GridActionsCellItem
        icon={<EditOutlinedIcon sx={defaultEditColumnIconStyle} />}
        label="Edit"
        className="textPrimary"
        onClick={handleEditClick(id)}
        color="inherit"
      />
    ),
    <GridActionsCellItem
      icon={<DeleteOutlineIcon sx={defaultEditColumnIconStyle} />}
      label="Delete"
      onClick={() => handleDeleteOpen(id)}
      color="inherit"
    />,
  ];
};

export default DataGridActions;
