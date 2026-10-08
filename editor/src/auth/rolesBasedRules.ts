import type { MopedRole } from "src/auth/claims";

type RoleRules = {
  label: string;
  static: string[];
};

// Read-only permissions not enforced by Can component
// since all authorized users should have access (except non-login users)
const readOnlyStaticRules = [
  "dashboard:visit",
  "projects:visit",
  "users:visit",
  "user:get",
  "moped:visit",
  "account:visit",
  "staff:visit",
  "project:visit",
  "settings:visit",
  "notFound:visit",
  "undefinedRoute:visit",
  "logout:visit",
  "404:visit",
  "all:visit",
  "style:visit",
  "dictionary:visit",
  "projects-map:visit",
];

const editorStaticRules = ["newProjects:visit"];

const adminStaticRules = [
  "user:create",
  "user:edit",
  "user:editRole",
  "user:delete",
  "newStaff:visit",
  "editStaff:visit",
  "lookups:edit",
];

export const rules = {
  "non-login-user": {
    label: "Non-login user",
    static: [] as string[],
  },
  "moped-viewer": {
    label: "Read-only",
    static: readOnlyStaticRules,
  },
  "moped-editor": {
    label: "Editor",
    static: [...readOnlyStaticRules, ...editorStaticRules],
  },
  "moped-admin": {
    label: "Admin",
    static: [...readOnlyStaticRules, ...editorStaticRules, ...adminStaticRules],
  },
} satisfies Record<MopedRole, RoleRules>;

export default rules;
