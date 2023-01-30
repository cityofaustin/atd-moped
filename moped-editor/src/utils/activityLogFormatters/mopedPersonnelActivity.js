import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
// import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatPersonnelActivity = (change, userList) => {
  let changeIcon = <PeopleAltOutlinedIcon />;
  // const entryMap = ProjectActivityLogTableMaps["moped_project"];

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
        { text: "Replaced " },
        { text: userList[changeData.old.user_id], style: "boldText" },
        { text: " with ", style: null },
        { text: userList[changeData.new.user_id], style: "boldText" },
      ],
    };
  }
  // updates to notes?

  // deleting a person??

  return {
      changeIcon,
      changeText: [
        { text: "Updated " },
        { text: userList[changeData.new.user_id], style: "boldText" },
      ],
    };
};
