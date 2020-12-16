import React from "react";

const Logo = props => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        textAlign: "center",
      }}
    >
      <img
        alt="Logo"
        src={`${process.env.PUBLIC_URL}/static/moped.svg`}
        {...props}
      />
    </div>
  );
};

export default Logo;
