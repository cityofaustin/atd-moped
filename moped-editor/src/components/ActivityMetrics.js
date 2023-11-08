import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LAST_SEEN_MUTATION } from "src/queries/staff";
import { useUser } from "src/auth/user";
/**
 * This wrapper calls the set_last_seen endpoint, which updates the user's
 * last_seen_date timestamp based on their session ID. this action happens
 * once each time this component mounts
 */
export default function ActivityMetrics({ children }) {
  const { user } = useUser();
  const [setLastSeen] = useMutation(LAST_SEEN_MUTATION);
  useEffect(() => {
    if (!user) {
      // this event can fire when the user is not logged in
      return;
    }
    setLastSeen().catch((error) => {
      console.error(
        "Failed to set the last seen date for the current user.",
        error
      );
    });
  }, [setLastSeen, user]);
  return children;
}
