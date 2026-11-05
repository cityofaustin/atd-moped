import { getAlertBannerSeverity } from "../helpers";

describe("getAlertBannerSeverity()", () => {
  it("shows a warning banner on local", () => {
    expect(getAlertBannerSeverity("local")).toBe("warning");
  });

  it("shows an info banner on every other environment", () => {
    expect(getAlertBannerSeverity("staging")).toBe("info");
    expect(getAlertBannerSeverity("preview")).toBe("info");
  });
});
