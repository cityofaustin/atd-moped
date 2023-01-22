import GroupOutlined from "@material-ui/icons/GroupOutlined";

export const formatPartnersActivity = (change, entityList) => {
  const changeIcon = <GroupOutlined />;
  let changeText = [{ text: "Project partners updated", style: null }];

  // Adding a new partner
  if (change.description.length === 0) {
    changeText = [
      { text: "Added project partner ", style: null },
      {
        text: entityList[change.record_data.event.data.new.entity_id],
        style: "boldText",
      },
    ];
  } else {
    // Soft deleting a partner is the only update a user can do (is_deleted is set to true)
    changeText = [
      { text: "Removed project partner ", style: null },
      {
        text: entityList[change.record_data.event.data.new.entity_id],
        style: "boldText",
      },
    ];
  }

  return { changeIcon, changeText };
};
