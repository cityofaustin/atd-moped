import {
  passwordLooksGood,
  roleLooksGood,
  transformFormDataIntoDatabaseTypes,
  isUserNonLoginUser,
  nonLoginUserRole,
} from "../helpers";

describe("passwordLooksGood()", () => {
  it("returns false for invalid passwords", () => {
    const noSpecialCharacter = "thisislongenoughbutisonlyletters";
    const notLongEnough = "shortpw?";
    const invalidCharacter = "`isnotavalidcharintheregex";

    expect(passwordLooksGood(noSpecialCharacter)).toBe(false);
    expect(passwordLooksGood(notLongEnough)).toBe(false);
    expect(passwordLooksGood(invalidCharacter)).toBe(false);
  });

  it("returns true for a valid password", () => {
    const validPassword = "Th1isis3nota4realpassword?";

    expect(passwordLooksGood(validPassword)).toBe(true);
  });
});

describe("roleLooksGood()", () => {
  it("returns false for no role or invalid role", () => {
    const noRoleSelected = [];
    const invalidRole = ["not-a-real-role"];

    expect(roleLooksGood(noRoleSelected)).toBe(false);
    expect(roleLooksGood(invalidRole)).toBe(false);
  });

  it("returns true for an valid role", () => {
    const validRole = "moped-editor";

    expect(roleLooksGood(validRole)).toBe(true);
  });
});

describe("transformFormDataIntoDatabaseTypes()", () => {
  const formOutputData = {
    workgroup_id: "1",
    roles: "moped-editor",
  };

  it("transforms a workgroup ID string from the form to an integer the DB expects", () => {
    const transformed = transformFormDataIntoDatabaseTypes(formOutputData);
    const { workgroup_id } = transformed;

    expect(workgroup_id).toBe(1);
    expect(workgroup_id).toEqual(expect.any(Number));
  });

  it("transforms a role string from the form to an array the DB expects", () => {
    const transformed = transformFormDataIntoDatabaseTypes(formOutputData);
    const { roles } = transformed;

    expect(roles.includes("moped-editor")).toBe(true);
    expect(roles).toEqual(expect.any(Array));
  });
});

describe("isUserNonLoginUser()", () => {
  const mopedUserRolesArray = ["moped-editor"];
  const nonLoginUserRolesArray = [nonLoginUserRole];

  it("returns false if user has a role only assigned to Moped users that can login", () => {
    const result = isUserNonLoginUser(mopedUserRolesArray);

    expect(result).toBe(false);
  });

  it("returns true if user has non-login user role", () => {
    const result = isUserNonLoginUser(nonLoginUserRolesArray);

    expect(result).toBe(true);
  });
});
