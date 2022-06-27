import React from "react";
import Link from "@mui/material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import makeStyles from '@mui/styles/makeStyles';

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
