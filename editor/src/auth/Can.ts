import { type ReactNode } from "react";
import { useAuth } from "src/auth/auth";
import rules from "./rolesBasedRules";

type Rules = typeof rules;

const check = (rules: Rules, role: string, action: string) => {
  // Collect user permissions and see if they include the given action
  const permissions = rules[role as keyof Rules];
  const staticPermissions = permissions?.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // Permissions for user's role allow this action
    return true;
  }

  // User permissions don't allow this action or they are undefined
  return false;
};

interface CanProps {
  /* The action the user is attempting to perform */
  perform: string;
  /* Content to render if the user is allowed to perform the action */
  yes?: ReactNode;
  /* Content to render if the user is not allowed to perform the action */
  no?: ReactNode;
}

const Can = ({ perform, yes = null, no = null }: CanProps) => {
  const auth = useAuth();

  // If initializing auth, render nothing rather than `no` which would
  // redirect to login before we know the role.
  if (auth.status === "initializing") return null;
  if (auth.status !== "authenticated") return no;

  const role = auth.role;
  return check(rules, role, perform) ? yes : no;
};

export default Can;
