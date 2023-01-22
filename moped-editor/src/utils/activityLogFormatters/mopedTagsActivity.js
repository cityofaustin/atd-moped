import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

export const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;
  let changeText = [{ text: "Project tags updated", style: null }];

  // Adding a new tag
  if (change.description.length === 0) {
    changeText = [
      { text: "Project tagged with ", style: null },
      {
        text: tagList[change.record_data.event.data.new.tag_id],
        style: "boldText",
      },
    ];
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true)
    changeText = [
      { text: "Project tag deleted  ", style: null },
      {
        text: tagList[change.record_data.event.data.new.tag_id],
        style: "boldText",
      },
    ];
  }

  return { changeIcon, changeText };
};
