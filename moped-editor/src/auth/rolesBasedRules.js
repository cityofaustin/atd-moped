// Read-only permissions not enforced by Can component
// since all authorized users should have access
const readOnlyStaticRules = [
  "dashboard:visit",
  "projects:visit",
  "users:visit",
  "user:get",
  "moped:visit",
];

const editorStaticRules = [];

const adminStaticRules = [
  "user:create",
  "user:edit",
  "user:editRole",
  "user:delete",
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
