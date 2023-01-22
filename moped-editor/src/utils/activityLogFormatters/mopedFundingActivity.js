import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import { isEqual } from "lodash";

export const formatFundingActivity = (
  change,
  fundingSources,
  fundingPrograms
) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_funding"];

  const changeIcon = <MonetizationOnOutlinedIcon />;
  let changeText = [{ text: "Project funding updated", style: null }];

  // add a new funding source
  if (change.description.length === 0) {
    changeText = [{ text: "Added a new funding source", style: null }];
    // if the added record has a funding source, use that as the change value
    if (change.record_data.event.data.new.funding_source_id) {
      changeText = [
        { text: "Added ", style: null },
        {
          text: fundingSources[
            change.record_data.event.data.new.funding_source_id
          ],
          style: "boldText",
        },
        { text: " as a new funding source." },
      ];
      // if not, then check if theres a funding program
    } else if (change.record_data.event.data.new.funding_program_id) {
      changeText = [
        { text: "Added ", style: null },
        {
          text: fundingPrograms[
            change.record_data.event.data.new.funding_program_id
          ],
          style: "boldText",
        },
        { text: " as a new funding source." },
      ];
    }
    return { changeIcon, changeText };
  }

  // delete an existing record
  if (change.description[0].field === "is_deleted") {
    changeText = [{ text: "Deleted a funding source", style: null }];
    // if the added record has a funding source, use that as the change value
    if (change.record_data.event.data.new.funding_source_id) {
      changeText = [
        { text: "Deleted a funding source: ", style: null },
        {
          text: fundingSources[
            change.record_data.event.data.new.funding_source_id
          ],
          style: "boldText",
        },
      ];
      // if not, then check if theres a funding program
    } else if (change.record_data.event.data.new.funding_program_id) {
      changeText = [
        { text: "Deleted a funding source: ", style: null },
        {
          text: fundingPrograms[
            change.record_data.event.data.new.funding_program_id
          ],
          style: "boldText",
        },
      ];
    }
    return { changeIcon, changeText };
  }

  // Multiple fields in the moped_proj_funding table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    // typeof(null) === "object", check that field is not null before checking if object
    if (!!newRecord[field] && typeof newRecord[field] === "object") {
      if (!isEqual(newRecord[field], oldRecord[field])) {
        changes.push(entryMap.fields[field]?.label);
      }
    } else if (newRecord[field] !== oldRecord[field]) {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  changeText = [
    { text: "Edited a funding source by updating the ", style: null },
    {
      text: changes.join(", "),
      style: "boldText",
    },
  ];

  return { changeIcon, changeText };
};
