import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

export const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;
  let changeDescription = "Project tags updated";
  let changeValue = ""

  // Adding a new tag
  if (change.description.length === 0) {
    changeDescription = "Project tagged with "
    changeValue = tagList[change.record_data.event.data.new.tag_id]
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true) can do
    changeDescription = "Project tag deleted "
    changeValue = tagList[change.record_data.event.data.new.tag_id]
  }

  return { changeIcon, changeDescription, changeValue };
};
