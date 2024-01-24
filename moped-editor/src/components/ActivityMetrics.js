import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { INSERT_USER_EVENT } from "src/queries/staff";
import { useUser } from "src/auth/user";
/**
 * This wrapper calls the set_last_seen endpoint, which updates the user's
 * last_seen_date timestamp based on their session ID. this action happens
 * once each time this component mounts
 */
export default function ActivityMetrics({ eventName, children }) {
  const { user } = useUser();
  const [setLastSeen] = useMutation(INSERT_USER_EVENT, {
    variables: { event_name: eventName },
  });
  const isLoggedIn = !!user;
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLastSeen().catch((error) => {
      console.error(
        `Failed to log the '${eventName}' event for the current user.`,
        error
      );
    });
  }, [setLastSeen, isLoggedIn]);
  return children;
}
