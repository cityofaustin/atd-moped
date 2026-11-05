import { type Page } from "@playwright/test";

/**
 * Answer Mapbox requests locally, so tests that open a map don't need a real
 * token or the network. The map loads with an empty style and draws nothing.
 */
export const stubMapbox = async (page: Page) => {
  await page.route(/^https:\/\/[^/]*mapbox\.com\//, (route) => {
    if (route.request().url().includes("/styles/v1/")) {
      return route.fulfill({
        json: { version: 8, name: "E2E", sources: {}, layers: [] },
      });
    }
    return route.fulfill({ status: 204 });
  });
};

/** Answer the Socrata signal lookup with one signal, instead of Austin's open data API */
export const stubSignals = async (
  page: Page,
  signal: { signalId: string; locationName: string }
) => {
  await page.route("**/resource/p53x-x73x.geojson*", (route) =>
    route.fulfill({
      json: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-97.75, 30.27] },
            properties: {
              id: `e2e-${signal.signalId}`,
              signal_id: signal.signalId,
              location_name: signal.locationName,
              signal_type: "TRAFFIC",
            },
          },
        ],
      },
    })
  );
};
