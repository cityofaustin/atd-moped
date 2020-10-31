import React from 'react';

import FormItem from './FormItem';
import StatesDropdown from './StatesDropdown';

const BillingAddressForm = ({ setForm, formData, navigation }) => {
  const {
    billingFirstName,
    billingLastName,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
  } = formData;
  const { next } = navigation;

  return (
    <div className="form">
      <h2>Billing Address</h2>

      <FormItem
        label="First Name"
        name="billingFirstName"
        value={billingFirstName}
        onChange={setForm}
      />
      <FormItem
        label="Last Name"
        name="billingLastName"
        value={billingLastName}
        onChange={setForm}
      />
      <FormItem
        label="Address"
        name="billingAddress"
        value={billingAddress}
        onChange={setForm}
      />
      <FormItem
        label="City"
        name="billingCity"
        value={billingCity}
        onChange={setForm}
      />
      <StatesDropdown
        label="State"
        name="billingState"
        value={billingState}
        onChange={setForm}
      />
      <FormItem
        label="Zip"
        name="billingZip"
        value={billingZip}
        onChange={setForm}
      />

      <div className="navigation">
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default BillingAddressForm;