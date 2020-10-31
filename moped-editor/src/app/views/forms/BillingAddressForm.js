import React from 'react';
import FormItem from './FormItem';
import PhasesDropdown from './StatesDropdown';

const BillingAddressForm = ({ setForm, formData, navigation }) => {
  const {
    project_name,
    current_phase,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
  } = formData;
  const { next } = navigation;

  return (
    <div className="form">
      <h2>Add New Project</h2>

      <FormItem
        label="Project Name"
        name="project_name"
        value={project_name}
        onChange={setForm}
      />
      <PhasesDropdown
        label="Select Phase"
        name="current_phase"
        value={current_phase}
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
      {/* <StatesDropdown
        label="State"
        name="billingState"
        value={billingState}
        onChange={setForm}
      /> */}
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