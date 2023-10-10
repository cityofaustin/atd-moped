// reduce the array of geography objects into an array of city council districts
const getCouncilDistricts = (data) => {
  const initialValue = [];
  const districts = data.reduce(
    (acc, component) => [...acc, component["council_districts"]],
    initialValue
  );

  // flatten the array of arrays and remove empty districts
  const districtsArray = districts.flat().filter(d=>d)

  // sort in ascending order and use Set to only return unique districts
  return [...new Set(districtsArray.sort((a, b) => a - b))];
};

export default getCouncilDistricts;