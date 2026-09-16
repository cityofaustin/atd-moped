import { useAuth } from "src/auth/auth";
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
  const { status, role } = useAuth();

  if (status === "initializing") return null;
  if (status !== "authenticated") return no;

  return check(rules, role, perform) ? yes : no;
};

export default Can;
