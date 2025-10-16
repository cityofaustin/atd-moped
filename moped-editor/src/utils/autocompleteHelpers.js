/*
/ MUI autocomplete filter function which limits number of options rendered in select menu
*/
export const filterOptions = (options, { inputValue, getOptionLabel }) => {
  console.log(options);
  // limits options to ensure fast rendering
  const limit = 40;
  // applies the default autocomplete matching behavior plus our limit filter
  const filteredOptions = options.filter(option =>
    getOptionLabel(option)
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  );
  return filteredOptions.slice(0, limit);
};
