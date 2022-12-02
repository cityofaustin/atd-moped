const { loadJsonFile } = require("../utils/loader");

const FNAME_MOPED_USERS = "./data/moped/moped_users_prod.json";
const FNAME_ACCESS_USERS = "./data/raw/employees.json";

const findMopedUser = (name, usersMoped) => {
  const matchLastName = usersMoped.find((user) =>
    name.includes(user.last_name.toLowerCase())
  );
  if (matchLastName) {
    return matchLastName;
  } else {
    console.log(name, " - not found ");
  }
};

function matchPeople() {
  const usersMoped = loadJsonFile(FNAME_MOPED_USERS);
  const usersAccess = loadJsonFile(FNAME_ACCESS_USERS);
  const usersMatched = [];
  usersAccess.map((user) => {
    const name = user.Name.toLowerCase();
    const userName = user.UserName;
    const mopedUser = findMopedUser(name, usersMoped);
    usersMatched.push({
      access_username: userName,
      access_name: user.Name,
      access_workgroup: user.Organization,
      access_title: user.Title,
      moped_first_name: mopedUser?.first_name,
      moped_last_name: mopedUser?.last_name,
      moped_email: mopedUser?.email,
      moped_workgroup: mopedUser?.workgroup,
    });
  });
  const notFound = usersMatched.filter((user) => !user.moped_email).length;
  console.log(`${notFound} not found out of ${usersMatched.length}`);
}

matchPeople();
