import EventNoteIcon from "@material-ui/icons/EventNote";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatPhasesActivity = (change, phaseList, subphaseList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_phases"];

  const changeIcon = <EventNoteIcon />;

  // add a new phase
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        {
          text: phaseList[change.record_data.event.data.new.phase_id],
          style: "boldText",
        },
        // include subphase name if a subphase exists
        ...(subphaseList[change.record_data.event.data.new.subphase_id]
          ? [
              {
                text: ` - ${
                  subphaseList[change.record_data.event.data.new.subphase_id]
                }`,
                style: "boldText",
              },
            ]
          : []),
        { text: " as a new phase.", style: null },
      ],
    };
  }

  // delete an existing phase
  if (change.description[0].field === "is_deleted") {
    return {
      changeIcon,
      changeText: [
        { text: "Deleted the phase ", style: null },
        {
          text: phaseList[change.record_data.event.data.new.phase_id],
          style: "boldText",
        },
        // include subphase name if a subphase exists
        ...(subphaseList[change.record_data.event.data.new.subphase_id]
          ? [
              {
                text: ` - ${
                  subphaseList[change.record_data.event.data.new.subphase_id]
                }`,
                style: "boldText",
              },
            ]
          : []),
      ],
    };
  }

  // Multiple fields in the moped_proj_funding table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    if (newRecord[field] !== oldRecord[field]) {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  return {
    changeIcon,
    changeText: [
      { text: "Edited the phase ", style: null },
      {
        text: phaseList[change.record_data.event.data.new.phase_id],
        style: "boldText",
      },
      // include subphase name if a subphase exists
      ...(subphaseList[change.record_data.event.data.new.subphase_id]
        ? [
            {
              text: ` - ${
                subphaseList[change.record_data.event.data.new.subphase_id]
              }`,
              style: "boldText",
            },
          ]
        : []),
      { text: " by updating the ", style: null },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ],
  };
};
