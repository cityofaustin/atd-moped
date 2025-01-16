import GroupOutlined from "@mui/icons-material/GroupOutlined";

export const formatPartnersActivity = (change, entityList) => {
  const changeIcon = <GroupOutlined />;

  // Adding a new partner
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added project partner ", style: null },
        {
          text: entityList[change.record_data.event.data.new.entity_id],
          style: "boldText",
        },
      ],
    };
  } else {
    const description = change?.description?.[0];
    const changedField = description?.field;

    // If the changed field is is_deleted, then the partner was removed
    if (changedField === "is_deleted") {
      return {
        changeIcon,
        changeText: [
          { text: "Removed project partner ", style: null },
          {
            text: entityList[change.record_data.event.data.new.entity_id],
            style: "boldText",
          },
        ],
      };
    }

    // Otherwise, the partner was changed. For example, the partner's name was changed.
    return {
      changeIcon,
      changeText: [
        { text: "Changed project partner ", style: null },
        {
          text: entityList[change.record_data.event.data.new.entity_id],
          style: "boldText",
        },
      ],
    };
  }
};
