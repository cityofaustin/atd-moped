export const filterNullValues = (value) => {
  if (!value) {
    return "-";
  } else {
    return value;
  }
};

export const filterProjectTeamMembers = (value) => {
  if (!value) {
    return "-";
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
  const projectTeamMembers = Object.keys(uniqueNames).map(
    (key) => `${key} - ${uniqueNames[key]}`
  );
  return projectTeamMembers.join(", ");
};

export const filterProjectFeatures = (value) => {
  // if there are no features, project_feature is [null]
  if (!value[0]?.properties?.signal_id) {
    return "-";
  } else {
    const signalIds = [];
    value.forEach((projectFeature) => {
      const signal = projectFeature?.properties?.signal_id;
      if (signal) {
        signalIds.push(signal);
      }
    });
    return signalIds.join(", ");
  }
};

export const filterTaskOrderName = (value) => {
  if (!value) {
    return "-";
  }
  const taskOrderArray = [];
  value.forEach((value) => {
    taskOrderArray.push(value.display_name);
  });
  return taskOrderArray.join(", ");
};
