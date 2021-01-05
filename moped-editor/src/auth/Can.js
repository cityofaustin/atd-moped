import rules from "./rolesBasedRules";

const check = (rules, role, action) => {
  // Collect user roles and check if any are authorized to render child component
  const permissions = rules[role];
  const staticPermissions = permissions?.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // Permissions for user's role allow this action
    return true;
  }

  return false;
};

const Can = ({ role, perform, yes = null, no = null }) => {
  return check(rules, role, perform) ? yes : no;
};

export default Can;
