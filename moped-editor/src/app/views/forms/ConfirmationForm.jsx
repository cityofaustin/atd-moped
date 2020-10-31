import React from "react";

const ConfirmationForm = ({ navagation }) => {
  return (
    <div className="form">
      <h2>Order Submitted</h2>
      <p>
        Your confirmation number is
        <br />
        <b>RCW-02-898-776</b>
      </p>
      <p>Thank you for your order!</p>
    </div>
  );
};

export default ConfirmationForm;