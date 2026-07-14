import { useEffect } from "react";

// Fixed ID for the <script> tag in the DOM. Used to avoid injecting the tracker twice
const SCRIPT_ELEMENT_ID = "umami-analytics";

const LOG_PREFIX = "[umami]";

/**
 * Loads the Umami tracker when script URL and website ID are configured.
 * Use per-environment VITE_UMAMI_* values so local/staging traffic does not
 * pollute production analytics (separate website IDs and/or data-domains).
 */
const UmamiAnalytics = () => {
  const appEnv = import.meta.env.VITE_APP_ENV;
  const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const domains = import.meta.env.VITE_UMAMI_DOMAINS;
  const tag = import.meta.env.VITE_UMAMI_TAG; // Optional label for filtering in Umami

  useEffect(() => {
    const hostname = window.location.hostname;

    console.info(`${LOG_PREFIX} initializing`, {
      appEnv,
      hostname,
      scriptUrl,
      websiteId,
      domains,
      tag,
    });

    if (!scriptUrl || !websiteId) {
      console.warn(
        `${LOG_PREFIX} tracker NOT loaded — missing ${
          !scriptUrl ? "VITE_UMAMI_SCRIPT_URL" : "VITE_UMAMI_WEBSITE_ID"
        }. Set it in the env file for this environment (${appEnv}).`
      );
      return;
    }

    // Avoid injecting the tracker twice
    if (document.getElementById(SCRIPT_ELEMENT_ID)) {
      console.debug(`${LOG_PREFIX} tracker already present, skipping injection`);
      return;
    }

    // data-domains is a comma-delimited allowlist that Umami matches against
    // window.location.hostname. If the current host isn't listed, the script
    // loads but silently sends no events (common cause of "nothing on deploy
    // previews", which run on *.netlify.app rather than the staging domain).
    if (domains) {
      const allowedHosts = domains.split(",").map((host) => host.trim());
      if (!allowedHosts.includes(hostname)) {
        console.warn(
          `${LOG_PREFIX} current hostname "${hostname}" is NOT in data-domains [${allowedHosts.join(
            ", "
          )}]. Umami will load but will NOT send events. Add this hostname to VITE_UMAMI_DOMAINS (or clear it) to track here.`
        );
      }
    }

    // Creates the <script> tag with the Umami tracker script.
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

    script.addEventListener("load", () => {
      console.info(
        `${LOG_PREFIX} script loaded successfully from ${scriptUrl} (window.umami ${
          typeof window.umami !== "undefined" ? "available" : "NOT available"
        })`
      );
    });

    script.addEventListener("error", () => {
      console.error(
        `${LOG_PREFIX} script FAILED to load from ${scriptUrl}. Check the URL, network, and any ad/tracker blockers.`
      );
    });

    document.head.appendChild(script);
    console.info(`${LOG_PREFIX} tracker script injected into <head>`);
  }, [appEnv, scriptUrl, websiteId, domains, tag]);

  return null;
};

export default UmamiAnalytics;
