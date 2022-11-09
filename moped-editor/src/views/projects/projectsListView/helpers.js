export const filterProjectTeamMembers = (value) => {
  if (!value) {
    return "";
  }
  const namesArray = value.split(",");
  const uniqueNames = {};
  namesArray.forEach((person) => {
    const [fullName, projectRole] = person.split(":");
    if (uniqueNames[fullName]) {
      uniqueNames[fullName] = uniqueNames[fullName] + `, ${projectRole}`;
    } else {
      uniqueNames[fullName] = projectRole;
    }
  });
  return Object.keys(uniqueNames).map((key) => (
    <span key={key} style={{display: "block"}}>
      {`${key} - ${uniqueNames[key]}`}
    </span>
  ));
};
