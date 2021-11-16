import React from "react";
import Link from "@material-ui/core/Link";

const RenderSignalLink = ({ signals }) => {
  const cleanSignals = signals.filter(s => s.knack_id);
  return (
    <span>
      {cleanSignals.map((signal, index) => (
        <Link
          href={`https://atd.knack.com/amd#projects/signal-details/${signal.knack_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {signal.signal_id}
          {index < cleanSignals.length - 1 && ", "}
        </Link>
      ))}
    </span>
  );
};

export default RenderSignalLink;
