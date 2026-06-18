import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

export const formatTagsActivity = (change, tagList) => {
  const changeIcon = <LocalOfferOutlinedIcon />;

  // Adding a new tag
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Project tagged with ", style: null },
        {
          text: tagList[change.record_data.event.data.new.tag_id],
          style: "boldText",
        },
      ],
    };
  } else {
    // Soft deleting a tag is the only update a user can do (is_deleted is set to true)
    return {
      changeIcon,
      changeText: [
        { text: "Project tag removed  ", style: null },
        {
          text: tagList[change.record_data.event.data.new.tag_id],
          style: "boldText",
        },
      ],
    };
  }
};
