import React from "react";

const Logo = props => {
  return (
    <img
      alt="Logo"
      src={`${process.env.PUBLIC_URL}/static/logo.svg`}
      {...props}
    />
  );
};

export default Logo;
