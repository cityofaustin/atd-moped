import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export const formatPersonnelActivity = (change, userList) => {
  let changeIcon = <PeopleOutlineIcon />;

  const changeData = change.record_data.event.data;

  // Adding a new person to project team
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        { text: userList[changeData.new.user_id], style: "boldText" },
        { text: " to the team", style: null },
      ],
    };
  }

  if (change.description[0].field === "user_id") {
    return {
      changeIcon,
      changeText: [
        { text: "Replaced team member " },
        { text: userList[changeData.old.user_id], style: "boldText" },
        { text: " with ", style: null },
        { text: userList[changeData.new.user_id], style: "boldText" },
      ],
    };
  }

  // remove a person from the team
  if (change.description[0].field === "is_deleted") {
    return {
      changeIcon,
      changeText: [
        { text: "Removed ", style: null },
        { text: userList[changeData.old.user_id], style: "boldText" },
        { text: " from the team", style: null },
      ],
    };
  }

  // update the notes field
  if (change.description[0].field === "notes")
    return {
    changeIcon,
    changeText: [
      { text: "Updated team member notes for " },
      { text: userList[changeData.new.user_id], style: "boldText" },
    ],
  };

  // the only other change that would be reflected here is adding or removing roles
  else {
    return {
      changeIcon,
      changeText: [
        { text: "Updated personnel role for "},
        { text: userList[changeData.new.user_id], style: "boldText"},
      ]
    }
  }
};
