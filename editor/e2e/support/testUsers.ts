/**
 * Dedicated non-SSO test users in the staging Cognito pool.
 *
 * userId must match the user's moped_users.user_id on staging, because login
 * tokens carry that ID and the app looks up moped_users with it.
 */
export const testUsers = {
  editor: {
    userId: 478,
    role: "moped-editor",
    title: "QA Editor",
    emailVar: "E2E_EDITOR_EMAIL",
    passwordVar: "E2E_EDITOR_PASSWORD",
  },
  admin: {
    userId: 479,
    role: "moped-admin",
    title: "QA Admin",
    emailVar: "E2E_ADMIN_EMAIL",
    passwordVar: "E2E_ADMIN_PASSWORD",
  },
} as const;

export const storageStatePath = (name: keyof typeof testUsers) =>
  `e2e/.auth/${name}.json`;
