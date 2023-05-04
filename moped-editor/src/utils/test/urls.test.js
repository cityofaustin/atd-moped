import { isValidUrl, makeUrlValid } from "../urls";

const httpAddress = "http://www.austintexas.gov";
const httpsAddress = "https://www.austintexas.gov";
const wwwOnlyAddress = "www.austintexas.gov";
const justLetters = "fjdksaljfdlksa";

describe("isValidUrl()", () => {
  it("validates a url using Yup", () => {
    expect(isValidUrl(httpAddress)).toBe(true);
    expect(isValidUrl(httpsAddress)).toBe(true);
    expect(isValidUrl(wwwOnlyAddress)).toBe(false);
    expect(isValidUrl(justLetters)).toBe(false);
  });
});

describe("makeUrlValid()", () => {
  it("tries to make a url valid", () => {
    expect(makeUrlValid(httpAddress)).toBe(httpAddress);
    expect(makeUrlValid(httpsAddress)).toBe(httpsAddress);
    expect(makeUrlValid(wwwOnlyAddress)).toBe("https://www.austintexas.gov");
    expect(makeUrlValid(justLetters)).toBe(justLetters);
  });
});
