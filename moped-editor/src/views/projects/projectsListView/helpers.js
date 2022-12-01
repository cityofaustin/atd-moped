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

export const filterProjectFeatures = (project_feature) => {
  // if there are no features, project_feature is [null]
  if (!project_feature[0]?.properties?.signal_id) {
    return "-";
  } else {
    const signalIds = [];
    project_feature.forEach((projectFeature) => {
      const signal = projectFeature?.properties?.signal_id;
      if (signal) {
        signalIds.push(signal);
      }
    });
    return signalIds.join(", ");
  }
};