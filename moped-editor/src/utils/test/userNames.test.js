import {
  unknownUserNameValue,
  getUserFullName,
  getInitials,
} from "../userNames";

// Some places where user names are stored
const userObjectFromHasura = {
  first_name: "Fozzie",
  last_name: "Bear",
};

// This comes from Local Storage
const atdMopedUserDbData = {
  first_name: "Bunsen",
  last_name: "Honeydew",
};

const invalidUserObject = {
  first_name: null,
  last_name: null,
};

describe("getFullUserName()", () => {
  it("returns a full name string from a user object", () => {
    const fullNameFromHasura = getUserFullName(userObjectFromHasura);

    expect(fullNameFromHasura).toBe("Fozzie Bear");
  });

  it("returns a full name string from a Local Storage object", () => {
    const fullNameFromLocalStorage = getUserFullName(atdMopedUserDbData);

    expect(fullNameFromLocalStorage).toBe("Bunsen Honeydew");
  });

  it("returns a fallback string from an invalid object", () => {
    const fullNameFromInvalidUserObject = getUserFullName(invalidUserObject);

    expect(fullNameFromInvalidUserObject).toBe(unknownUserNameValue);
  });

  it("returns a fallback string from an object without name keys", () => {
    const fullNameFromEmptyObject = getUserFullName({});

    expect(fullNameFromEmptyObject).toBe(unknownUserNameValue);
  });

  it("returns a fallback string from null", () => {
    const fullNameFromNull = getUserFullName(null);

    expect(fullNameFromNull).toBe(unknownUserNameValue);
  });
});

describe("getInitials()", () => {
  it("returns initials from a user object", () => {
    const initialsFromHasura = getInitials(userObjectFromHasura);

    expect(initialsFromHasura).toBe("FB");
  });

  it("returns initials from a Local Storage object", () => {
    const initialsFromLocalStorage = getInitials(atdMopedUserDbData);

    expect(initialsFromLocalStorage).toBe("BH");
  });

  it("returns null from an invalid object", () => {
    const initialsFromInvalidUserObject = getInitials(invalidUserObject);

    expect(initialsFromInvalidUserObject).toBe(null);
  });

  it("returns null from an object without name keys", () => {
    const initialsFromEmptyObject = getInitials({});

    expect(initialsFromEmptyObject).toBe(null);
  });

  it("returns null from null", () => {
    const initialsFromNull = getInitials(null);

    expect(initialsFromNull).toBe(null);
  });
});
