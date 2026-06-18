import SwitchAccessShortcutAddOutlinedIcon from "@mui/icons-material/SwitchAccessShortcutAddOutlined";

export const formatMigratedProjectActivity = () => {
  const changeIcon = <SwitchAccessShortcutAddOutlinedIcon />;
  return {
    changeIcon,
    changeText: [
      {
        text: "Imported this project from the legacy MS Access project database",
        style: null,
      },
    ],
  };
};
