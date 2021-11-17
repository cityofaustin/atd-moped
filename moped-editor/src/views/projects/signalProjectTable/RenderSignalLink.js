import React from "react";
import Link from "@material-ui/core/Link";

const RenderSignalLink = ({ signals }) => {
  return (
    <span>
      {signals.map((signal, index) => (
        <>
          {signal?.knack_id ? (
            <Link
              href={`https://atd.knack.com/amd#projects/signal-details/${signal.knack_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {signal.signal_id}
            </Link>
          ) : (
            signal.signal_id
          )}
          {index < signals.length - 1 && ", "}
        </>
      ))}
    </span>
  );
};

export default RenderSignalLink;
