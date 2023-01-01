import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

export const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;
  let changeText = "Project tags updated";

  // Adding a new tag
  if (change.description.length === 0) {
    changeText = `Project tagged with "${
      tagList[change.record_data.data.new.tag_id]
    }" `;
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true) can do
    changeText = `"${
      tagList[change.record_data.data.new.tag_id]
    }" removed from tags`;
  }

  return { changeText, changeIcon };
};
