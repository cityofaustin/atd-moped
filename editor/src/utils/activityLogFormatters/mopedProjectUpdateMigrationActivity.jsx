import SwitchAccessShortcutAddOutlinedIcon from "@mui/icons-material/SwitchAccessShortcutAddOutlined";

export const formatMigratedProjectUpdateActivity = () => {
  const changeIcon = <SwitchAccessShortcutAddOutlinedIcon />;
  return {
    changeIcon,
    changeText: [
      {
        text: "Imported project updates from the legacy MS Access project database",
        style: null,
      },
    ],
  };
};
