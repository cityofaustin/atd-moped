const { loadJsonFile } = require("./utils/loader");
const { mapRow } = require("./utils/misc");
const { PROJECT_ROLES_MAP } = require("./mappings/project_roles");
const { USERS_FNAME } = require("./moped_users");
const USERS = loadJsonFile(USERS_FNAME);
const PROJ_PERSONNEL_FNAME = "./data/raw/project_personnel.json";
const PROJ_PERSONNEL = loadJsonFile(PROJ_PERSONNEL_FNAME);

const fields = [
  { in: "ProjectID", out: "interim_project_id" },
  {
    in: "Employee",
    out: "user_id",
    transform: (row) => {
      const thisUser = row.Employee;
      if (!thisUser) {
        debugger;
      }
      const matchedUser = USERS.find(
        (user) =>
          `${user.first_name} ${user.last_name}`.toLowerCase() ===
          thisUser.toLowerCase()
      );
      if (!matchedUser) {
        console.log("USER NOT FOUND: ", thisUser);
        debugger;
        throw `User not found`;
      }
      return matchedUser?.user_id || 1;
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
  // there are some "Inactive" personnel to be ignore
  // and also personnel with a `null` employee
  // todo: check w/ NW this is ok (inactive personnel in Moped are deleted/hidden)
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
