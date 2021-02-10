import { getHighestRole, useUser } from "../auth/user";
import rules from "./rolesBasedRules";

const check = (rules, role, action) => {
  // Collect user permissions and see if they include the given action
  const permissions = rules[role];
  const staticPermissions = permissions?.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // Permissions for user's role allow this action
    return true;
  }

  // User permissions don't allow this action or they are undefined
  return false;
};

const Can = ({ perform, yes = null, no = null }) => {
  const { user } = useUser();
  const role = getHighestRole(user);

  return check(rules, role, perform) ? yes : no;
};

export default Can;
