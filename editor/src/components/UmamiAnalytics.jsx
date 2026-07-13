import { useEffect } from "react";

// Fixed ID for the <script> tag in the DOM. Used to avoid injecting the tracker twice
const SCRIPT_ELEMENT_ID = "umami-analytics";

/**
 * Loads the Umami tracker when script URL and website ID are configured.
 * Use per-environment VITE_UMAMI_* values so local/staging traffic does not
 * pollute production analytics (separate website IDs and/or data-domains).
 */
const UmamiAnalytics = () => {
  const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const domains = import.meta.env.VITE_UMAMI_DOMAINS;
  const tag = import.meta.env.VITE_UMAMI_TAG; // Optional label for filtering in Umami

  useEffect(() => {
    if (!scriptUrl || !websiteId) {
      return;
    }

    // Avoid injecting the tracker twice
    if (document.getElementById(SCRIPT_ELEMENT_ID)) {
      return;
    }

    // Create the <script> tag with the Umami tracker script.
    // This should match the "Tracking code" in the Umami dashboard
    // ex: https://umami.austinmobility.io/websites/ff41f9d2-8808-4380-b025-81c933ac3812/settings
    const script = document.createElement("script");
    script.id = SCRIPT_ELEMENT_ID;
    script.defer = true;
    script.src = scriptUrl;
    script.setAttribute("data-website-id", websiteId);

    if (domains) {
      script.setAttribute("data-domains", domains);
    }

    if (tag) {
      script.setAttribute("data-tag", tag);
    }

    document.head.appendChild(script);
  }, [scriptUrl, websiteId, domains, tag]);

  return null;
};

export default UmamiAnalytics;
