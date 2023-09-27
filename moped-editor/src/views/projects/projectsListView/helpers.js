export const filterNullValues = (value) => {
  if (!value || value === "-") {
    return "";
  } else {
    return value;
  }
};

export const filterProjectTeamMembers = (value, view) => {
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
  // if the view is projectsListView, render each team member as a block
  if (view === "projectsListView") {
    return Object.keys(uniqueNames).map((key) => (
      <span key={key} style={{ display: "block" }}>
        {`${key} - ${uniqueNames[key]}`}
      </span>
    ));
  } else {
    const projectTeamMembers = Object.keys(uniqueNames).map(
      (key) => `${key} - ${uniqueNames[key]}`
    );
    return projectTeamMembers.join(", ");
  }
};

export const filterProjectSignals = (value) => {
  if (!value) {
    return "";
  } else {
    return value
      .filter((signal) => signal.signal_id)
      .map((signal) => signal.signal_id)
      .join(", ");
  }
};

export const filterTaskOrderName = (value) => {
  if (!value) {
    return "";
  }
  const taskOrderArray = [];
  value.forEach((value) => {
    taskOrderArray.push(value.display_name);
  });
  return taskOrderArray.join(", ");
};

export const filterStatusUpdate = (value) => {
  if (!value || value === "-") {
    return "";
  } else {
    // escape " by preceding it with another "
    if (value.includes('"')) {
      value = value.replace(/"/g, '""');
    }
    // escape , by wrapping it in ""
    if (value.includes(",")) {
      value = value.replace(/,/g, '"",""');
    }
    return value;
  }
};
