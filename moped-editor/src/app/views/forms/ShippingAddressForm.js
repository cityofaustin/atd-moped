import React from 'react';
import FormItem from './FormItem';


const ShippingAddressForm = ({ setForm, formData, navigation }) => {
  const {
    billingFirstName,
    billingLastName,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
    shippingSameAsBilling,
    shippingFirstName,
    shippingLastName,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
  } = formData;
  const { previous, next } = navigation;

  return (
    <div className="form">
      <h2>Shipping Address</h2>

      <FormItem
        label="Same as Billing"
        name="shippingSameAsBilling"
        checked={shippingSameAsBilling}
        onChange={setForm}
        type="checkbox"
      />
      <FormItem
        label="First Name"
        name="shippingFirstName"
        value={shippingSameAsBilling ? billingFirstName : shippingFirstName}
        onChange={setForm}
        disabled={shippingSameAsBilling}
      />
      <FormItem
        label="Last Name"
        name="shippingLastName"
        value={shippingSameAsBilling ? billingLastName : shippingLastName}
        onChange={setForm}
        disabled={shippingSameAsBilling}
      />
      <FormItem
        label="Address"
        name="shippingAddress"
        value={shippingSameAsBilling ? billingAddress : shippingAddress}
        onChange={setForm}
        disabled={shippingSameAsBilling}
      />
      <FormItem
        label="City"
        name="shippingCity"
        value={shippingSameAsBilling ? billingCity : shippingCity}
        onChange={setForm}
        disabled={shippingSameAsBilling}
      />
      <FormItem
        label="Zip"
        name="shippingZip"
        value={shippingSameAsBilling ? billingZip : shippingZip}
        onChange={setForm}
        disabled={shippingSameAsBilling}
      />

      <div className="navigation">
        <button onClick={previous}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default ShippingAddressForm;

