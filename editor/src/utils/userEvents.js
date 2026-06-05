import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useUser } from "src/auth/user";
import { INSERT_USER_EVENT } from "src/queries/staff";

/**
 * Custom hook that provides a function to log user activity events.
 * Use this in event handlers to supplement the ActivityMetrics wrapper
 * (which logs events on render).
 *
 * @returns {function(string): void} A function that logs an event with the given name.
 *   Safe to call when the user is not authenticated — it will do nothing in that case.
 *
 * @example
 * const logUserEvent = useLogUserEvent();
 *
 * const handleSyncToggle = () => {
 *   logUserEvent("funding_ecapris_sync_toggle");
 *   updateShouldSyncECapris({ ... });
 * };
 */
export function useLogUserEvent() {
  const { user } = useUser();
  const [insertUserEvent] = useMutation(INSERT_USER_EVENT);

  const logUserEvent = useCallback(
    (eventName) => {
      if (!eventName || !user) {
        return;
      }

      insertUserEvent({ variables: { event_name: eventName } }).catch(
        (error) => {
          console.error(
            `Failed to log the '${eventName}' event for the current user.`,
            error
          );
        }
      );
    },
    [insertUserEvent, user]
  );

  return logUserEvent;
}
