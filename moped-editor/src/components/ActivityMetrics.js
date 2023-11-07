import { Fragment, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LAST_SEEN_MUTATION } from "src/queries/users";

export default function ActivityMetrics({ children }) {
  const [setLastSeen] = useMutation(LAST_SEEN_MUTATION);
  useEffect(() => {
    try {
      setLastSeen();
    } catch (error) {
      console.error("Failed to set last seen date date");
    }
  }, []);
  return <Fragment>{children}</Fragment>;
}
