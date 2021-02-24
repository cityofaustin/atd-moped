import React from "react";

const ExternalLink = ({ url, text }) => {
  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </div>
  );
};

export default ExternalLink;
