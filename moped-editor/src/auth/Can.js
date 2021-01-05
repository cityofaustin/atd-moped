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

const Can = props =>
  check(rules, props.role, props.perform) ? props.yes() : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export default Can;
