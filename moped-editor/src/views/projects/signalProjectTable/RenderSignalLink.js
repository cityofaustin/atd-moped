import React from "react";
import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  openInNewIcon: {
    fontSize: "16px",
    verticalAlign: "middle",
    paddingBottom: "1px",
  },
}));

const RenderSignalLink = ({ signals }) => {
  const classes = useStyles();
  return (
    <span>
      {signals.map((signal, index) => (
        <React.Fragment key={signal.signal_id}>
          {signal?.knack_id ? (
            <Link
              href={`https://atd.knack.com/amd#signals/signal-details/${signal.knack_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {signal.signal_id}
              <OpenInNewIcon className={classes.openInNewIcon} />
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
