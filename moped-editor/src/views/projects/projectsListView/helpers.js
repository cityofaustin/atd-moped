export const filterProjectTeamMembers = value => {
  if (value === " :") {
    return "";
  }
  const namesArray = value.split(",");
  const uniqueNames = {};
  namesArray.forEach(person => {
    const [fullName, projectRole] = person.split(":");
    if (uniqueNames[fullName]) {
      uniqueNames[fullName] = uniqueNames[fullName] + `, ${projectRole}`;
    } else {
      uniqueNames[fullName] = projectRole;
    }
  });
  const personnel = Object.keys(uniqueNames).map(
    key => `${key} - ${uniqueNames[key]}`
  );

  return personnel.join("\n");
};
