const { loadJsonFile } = require("./utils/loader");
const { mapRow } = require("./utils/misc");
const { PROJECT_ROLES_MAP } = require("./mappings/project_roles");
const { USERS_FNAME } = require("./moped_users");
let USERS;
const PROJ_PERSONNEL_FNAME = "./data/raw/project_personnel.json";
const PROJ_PERSONNEL = loadJsonFile(PROJ_PERSONNEL_FNAME);

const getEmployeeId = (userName, users) => {
  // the access DB references users as "<first name> <last name>"
  // so that's all we have to go on for matching. at the time
  // of running this, all users with a matching first and last name
  // should exist in the production moped database. the migration
  // always downloads the lasest user list from prod. if a user is
  // not found, you should create them in production and staging.
  // it does not matter if the user is active/inactive or what their
  // role is (admin/editor/viewer/nologin) — they just need to exist!
  if (userName === "_Unknown") {
    userName = "Nathan Wilkes";
  }
  const matchedUser = users.find(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase() ===
      userName.toLowerCase()
  );
  if (!matchedUser) {
    console.log("USER NOT FOUND: ", userName);
    debugger;
    throw `User not found`;
  }
  return matchedUser.user_id;
};

const fields = [
  { in: "ProjectID", out: "interim_project_id" },
  {
    in: "Employee",
    out: "user_id",
    transform: (row) => {
      const userName = row.Employee;
      if (!userName) {
        throw `Personnel record missing user name`;
      }
      return getEmployeeId(userName, USERS);
    },
  },
  {
    in: "ProjectRole",
    out: "moped_proj_personnel_roles",
    required: true,
    transform(row) {
      const roleName = row.ProjectRole;
      const roleMatch = PROJECT_ROLES_MAP.find((role) => role.in === roleName);
      if (!roleMatch) {
        throw `Unknown project role: ${roleName}`;
      }
      // structure this value for nested hasura insert into
      // many-to-many table (moped_proj_personnel_roles)
      return { data: [{ project_role_id: roleMatch.out }] };
    },
  },
  {
    in: "AdditionalDetail",
    out: "notes",
  },
];

function getPersonnel() {
  USERS = loadJsonFile(USERS_FNAME);
  // there are some "Inactive" personnel to be ignore
  // and also personnel with a `null` employee
  const peopleRoles = PROJ_PERSONNEL.filter(
    (pers) => pers.Status === "Active" && pers.Employee
  );
  //  map each row
  const peopleRolesMapped = peopleRoles.map((row) => mapRow(row, fields));
  // index by interim project id
  const personnelRoleIndex = peopleRolesMapped.reduce(
    (index, { interim_project_id, ...row }) => {
      index[interim_project_id] ??= [];
      index[interim_project_id].push(row);
      return index;
    },
    {}
  );
  return personnelRoleIndex;
}

exports.getPersonnel = getPersonnel;
exports.getEmployeeId = getEmployeeId;
