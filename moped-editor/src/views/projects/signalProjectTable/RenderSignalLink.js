import React from "react";
import Link from "@material-ui/core/Link";

const RenderSignalLink = ({signals}) => {
  console.log(signals)
  return (
    <span>
    {signals.map(signal => (
      <Link
        href={`https://atd.knack.com/amd#projects/signal-details/${signal.knack_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {signal.signal_id}{" "}
      </Link>)
      )}
    </span>
)}


export default RenderSignalLink;
