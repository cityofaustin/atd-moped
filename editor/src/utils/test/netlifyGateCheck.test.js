/**
 * TEMPORARY: fails on purpose to prove a failing test stops the Netlify build.
 * Delete this file once the deploy preview has failed (atd-data-tech#31091).
 */
describe("Netlify test gate check", () => {
  it("fails on purpose: this should stop the deploy preview", () => {
    expect("deploy preview built").toBe("deploy preview blocked by failing test");
  });
});
