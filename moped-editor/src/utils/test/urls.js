import { isValidUrl } from "../urls";

describe("isValidUrl()", () => {
  it("validates a url using Yup", () => {
    const httpAddress = "http://www.austintexas.gov";
    const httpsAddress = "https://www.austintexas.gov";
    const wwwOnlyAddress = "www.austintexas.gov";
    const justLetters = "fjdksaljfdlksa";

    expect(isValidUrl(httpAddress)).toBe(true);
    expect(isValidUrl(httpsAddress)).toBe(true);
    expect(isValidUrl(wwwOnlyAddress)).toBe(false);
    expect(isValidUrl(justLetters)).toBe(false);
  });
});
