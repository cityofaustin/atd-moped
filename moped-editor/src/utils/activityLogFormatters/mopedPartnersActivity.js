import GroupOutlined from "@material-ui/icons/GroupOutlined";

export const formatPartnersActivity = (change, entityList) => {
  const changeIcon = <GroupOutlined />;
  const changeText = [];

  // Adding a new partner
  if (change.description.length === 0) {
    changeText.push({ text: "Added project partner ", style: null });
    changeText.push({
      text: entityList[change.record_data.event.data.new.entity_id],
      style: "boldText",
    });
  } else {
    // Soft deleting a partner is the only update a user can do (is_deleted is set to true)
    changeText.push({ text: "Removed project partner ", style: null });
    changeText.push({
      text: entityList[change.record_data.event.data.new.entity_id],
      style: "boldText",
    });
  }

  return { changeIcon, changeText };
};
