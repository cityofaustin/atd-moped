import React from "react";
import Link from "@mui/material/Link";

const RenderSignalLink = ({ signals }) => {
  return (
    <span>
      {signals.map((signal, index) => (
        <React.Fragment key={signal.id}>
          {signal?.knack_id ? (
            <Link
              href={`https://atd.knack.com/amd#signals/signal-details/${signal.knack_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {signal.signal_id}
            </Link>
          ) : (
            signal.signal_id
          )}
          {index < signals.length - 1 && ", "}
        </React.Fragment>
      ))}
    </span>
  );
};

export default RenderSignalLink;
