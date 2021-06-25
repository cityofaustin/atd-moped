// Read-only permissions not enforced by Can component
// since all authorized users should have access
const readOnlyStaticRules = [
  "dashboard:visit",
  "projects:visit",
  "users:visit",
  "user:get",
  "moped:visit",
  "dashboard:visit",
  "account:visit",
  "staff:visit",
  "project:visit",
  "projects:visit",
  "settings:visit",
  "notFound:visit",
  "undefinedRoute:visit",
  "logout:visit",
  "settings:visit",
  "404:visit",
  "all:visit",
  "style:visit",
];

const editorStaticRules = ["newProjects:visit"];

const adminStaticRules = [
  "user:create",
  "user:edit",
  "user:editRole",
  "user:delete",
  "newStaff:visit",
  "editStaff:visit",
];

export const rules = {
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
};

export default rules;
