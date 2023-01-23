import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

export const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;
  let changeText = [];

  // Adding a new tag
  if (change.description.length === 0) {
    changeText.push({ text: "Project tagged with ", style: null });
    changeText.push({
      text: tagList[change.record_data.event.data.new.tag_id],
      style: "boldText",
    });
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true)
    changeText.push({ text: "Project tag deleted  ", style: null });
    changeText.push({
      text: tagList[change.record_data.event.data.new.tag_id],
      style: "boldText",
    });
  }

  return { changeIcon, changeText };
};
