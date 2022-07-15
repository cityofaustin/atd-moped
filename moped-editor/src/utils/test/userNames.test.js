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
    const fullNameFromLocalStorage = getUserFullName(atdMopedUserDbData);
    const fullNameFromInvalidUserObject = getUserFullName(invalidUserObject);

    expect(fullNameFromHasura).toBe("Fozzie Bear");
    expect(fullNameFromLocalStorage).toBe("Bunsen Honeydew");
    expect(fullNameFromInvalidUserObject).toBe(unknownUserNameValue);
  });
});

describe("getInitials()", () => {
  it("returns initials from a user object", () => {
    const initialsFromHasura = getInitials(userObjectFromHasura);
    const initialsFromLocalStorage = getInitials(atdMopedUserDbData);
    const initialsFromInvalidUserObject = getInitials(invalidUserObject);

    expect(initialsFromHasura).toBe("FB");
    expect(initialsFromLocalStorage).toBe("BH");
    expect(initialsFromInvalidUserObject).toBe(null);
  });
});
