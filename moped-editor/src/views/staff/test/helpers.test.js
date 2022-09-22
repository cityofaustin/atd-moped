import {
  passwordLooksGood,
  roleLooksGood,
  transformFormDataIntoDatabaseTypes,
  isUserNonLoginUser,
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
    // const validPassword = "BuqXgUvizyZGB9Xc-*D*";
    // const validPassword = "Th1isis3nota4realpassword?";
    const validPassword = "Thhh13p?";

    expect(passwordLooksGood(validPassword)).toBe(true);
  });

  //     it("returns a full name string from a Local Storage object", () => {
  //       const fullNameFromLocalStorage = getUserFullName(atdMopedUserDbData);

  //       expect(fullNameFromLocalStorage).toBe("Bunsen Honeydew");
  //     });

  //     it("returns a fallback string from an invalid object", () => {
  //       const fullNameFromInvalidUserObject = getUserFullName(invalidUserObject);

  //       expect(fullNameFromInvalidUserObject).toBe(unknownUserNameValue);
  //     });

  //     it("returns a fallback string from an object without name keys", () => {
  //       const fullNameFromEmptyObject = getUserFullName({});

  //       expect(fullNameFromEmptyObject).toBe(unknownUserNameValue);
  //     });

  //     it("returns a fallback string from null", () => {
  //       const fullNameFromNull = getUserFullName(null);

  //       expect(fullNameFromNull).toBe(unknownUserNameValue);
  //     });
  //   });

  //   describe("getInitials()", () => {
  //     it("returns initials from a user object", () => {
  //       const initialsFromHasura = getInitials(userObjectFromHasura);

  //       expect(initialsFromHasura).toBe("FB");
  //     });

  //     it("returns initials from a Local Storage object", () => {
  //       const initialsFromLocalStorage = getInitials(atdMopedUserDbData);

  //       expect(initialsFromLocalStorage).toBe("BH");
  //     });

  //     it("returns null from an invalid object", () => {
  //       const initialsFromInvalidUserObject = getInitials(invalidUserObject);

  //       expect(initialsFromInvalidUserObject).toBe(null);
  //     });

  //     it("returns null from an object without name keys", () => {
  //       const initialsFromEmptyObject = getInitials({});

  //       expect(initialsFromEmptyObject).toBe(null);
  //     });

  //     it("returns null from null", () => {
  //       const initialsFromNull = getInitials(null);

  //       expect(initialsFromNull).toBe(null);
  //     });
});
