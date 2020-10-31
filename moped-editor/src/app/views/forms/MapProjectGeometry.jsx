import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// import { TextField } from "@material-ui/core";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";

const MapProjectGeometry= ({ formContent }) => {
  const methods = useFormContext();
  const { reset } = methods;
  useEffect(() => {
    reset({ ...formContent.three }, { errors: true });
  }, [formContent, reset]);

  // const options = ["option 1", "option 2", "option 3"];

  // const [value, setValue] = useState("");

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  // }

  const { register, control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray(
    {
      control,
      name: "items"
    }
  );

  const [value, setValue] = useState("");
  
  const onSubmit = (data) => console.log("data", data);
  const handleChange = (data) =>
  setValue("data", data);
  return (
       <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({id, name, role, group}, index) => {
          return (
            <div key={id}>
              <select
              ref={register()}
              name={`items[${index}].name`}
              defaultValue={name}
              value={value}
              onChange={handleChange}
              >
                <option value= "">Select Name</option>
                <option value= "Leslie">Leslie</option>
                <option value= "Jared">Jared</option>
              </select>
              <select
              ref={register()}
              name={`items[${index}].role`}
              defaultValue={role}
              value={value}
              onChange={handleChange}
              >
                <option value= "">Select Role</option>
                <option value= "Manager">Manager</option>
                <option value= "Engineer">Engineer</option>
              </select>
              <select
              ref={register()}
              name={`items[${index}].group`}
              defaultValue={group}
              value={value}
              onChange={handleChange}
              >
                <option value= "">Select Group</option>
                <option value= "ATD">ATD</option>
                <option value= "Arterial Management">Arterial Management</option>
              </select>
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button> 
              </div>
          );
        })}      
            <section>
              <button
                type="button"
                onClick={() => 
                append({})}>
                Add 
              </button>    
            </section>
      <input type="submit" />
    </form>
  );
      {/* <form>
      <Autocomplete
          id="selectedOptions"
          options={options}
          value={value}
          defaultValue=""
          name="options"
          onChange={handleChange}
          style={{ width: 150 }}
          renderInput={(params) => <TextField {...params} label="Options" 
          margin="normal" />} 
        />
      </form> */}
   
  
}
  
export default MapProjectGeometry;