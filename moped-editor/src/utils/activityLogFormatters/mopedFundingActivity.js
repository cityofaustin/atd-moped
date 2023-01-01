import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';

export const formatFundingActivity = (change) => {

  console.log(change)
  const changeIcon = <MonetizationOnOutlinedIcon />;
  let changeText = "Project funding updated";

  // add a new funding source
  if (change.description.length === 0) {
    //     changeText = `${changeData.new.project_name} created`;
    // changeIcon = <BeenhereOutlinedIcon />;
    // return { changeText, changeIcon };
  }

  // edit existing record

  // delete existing record


  return { changeText, changeIcon };
};
