import { useComponentOptions, useSubcomponentOptions } from "../utils";

const responseData = {
  moped_components: [
    {
      id: 1,
      component_name: "Cool component with subtypes",
      component_subtype: "Test",
    },
    {
      id: 2,
      component_name: "Cool component without subtype",
      component_subtype: null,
    },
    {
      id: 3,
      component_name: "Cool component with subcomponents",
      component_subtype: null,
      moped_subcomponents: [
        { subcomponent_name: "Cool subcomponent", subcomponent_id: 1 },
        { subcomponent_name: "Awesome subcomponent", subcomponent_id: 2 },
      ],
    },
  ],
};

describe("useComponentOptions()", () => {
  it("creates component options from moped_components response data", () => {
    const componentsOptions = useComponentOptions(responseData);
    console.log(componentsOptions);

    // expect(componentsOptions).toBe("1/15/2022");
  });
});
