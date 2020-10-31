import React from 'react';
import FormItem from './FormItem';
import shippingMethods from './shippingMethods';

const ShippingMethodForm = ({ setForm, formData, navigation }) => {
  const { shippingMethod } = formData;
  const { previous, next } = navigation;

  return (
    <div className="form">
      <h2>Shipping Method</h2>

      {Object.entries(shippingMethods).map(([value, name]) => (
        <FormItem
          label={name}
          name="shippingMethod"
          value={value}
          checked={shippingMethod === value}
          onChange={setForm}
          type="radio"
        />
      ))}

      <div className="navigation">
        <button onClick={previous}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;