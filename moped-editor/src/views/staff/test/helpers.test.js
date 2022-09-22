import {
  passwordLooksGood,
  roleLooksGood,
  transformFormDataIntoDatabaseTypes,
  isUserNonLoginUser,
  nonLoginUserRole,
} from "../helpers";

describe("passwordLooksGood()", () => {
  it("returns false for an invalid passwords", () => {
    const noSpecialCharacter = "thisislongenoughbutisonlyletters";
    const notLongEnough = "shortpw?";
    const invalidCharacter = "`isnotavalidcharintheregex";

    expect(passwordLooksGood(noSpecialCharacter)).toBe(false);
    expect(passwordLooksGood(notLongEnough)).toBe(false);
    expect(passwordLooksGood(invalidCharacter)).toBe(false);
  });

  it("returns true for an valid passwords", () => {
    const validPassword = "Th1isis3nota4realpassword?";

    expect(passwordLooksGood(validPassword)).toBe(true);
  });
});
