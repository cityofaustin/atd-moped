import GroupOutlined from "@material-ui/icons/GroupOutlined";

export const formatPartnersActivity = (change, entityList) => {
  const changeIcon = <GroupOutlined />;
  let changeDescription = "Project partners updated";
  let changeValue = ""

  console.log(change.record_data.event.data.new);

  // Adding a new partner
  if (change.description.length === 0) {
    changeDescription = "Added project partner "
    changeValue = entityList[change.record_data.event.data.new.entity_id]
  } else {
    // Soft deleting a partner is the only update a user can do (is_deleted is set to true)
    changeDescription = "Removed project partner "
    changeValue = entityList[change.record_data.event.data.new.entity_id]
  }

  return { changeIcon, changeDescription, changeValue };
};
