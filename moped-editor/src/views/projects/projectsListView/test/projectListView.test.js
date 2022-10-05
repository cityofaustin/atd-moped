import { render, screen, fireEvent } from "src/utils/testUtils";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GQLAbstract from "src/libs/GQLAbstract";
import GridTableFilters from "src/components/GridTable/GridTableFilters";
import { ProjectsListViewQueryConf } from "../ProjectsListViewQueryConf";
import { ProjectsListViewFiltersConf } from "../ProjectsListViewFiltersConf";
import { createBrowserHistory } from "history";

// Show DOM in test runner
// screen.debug();

let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);
const filterQuery = new URLSearchParams("");
const history = createBrowserHistory();

// Find a config with a lookup key
const filterConfigsWithLookups = ProjectsListViewFiltersConf.fields.filter(
  (config) => config.hasOwnProperty("lookup")
);

describe("ProjectListView", () => {
  const user = userEvent.setup();

  render(
    <GridTableFilters
      query={projectsQuery}
      filterState={{ filterParameters: {}, setFilterParameters: () => true }}
      filterQuery={filterQuery}
      history={history}
      handleAdvancedSearchClose={() => true}
    />
  );

  it("renders the 'Add Filter' button to start filtering by clicking", async () => {
    const addFilterButton = screen.getByText("Add Filter");
    expect(addFilterButton).toBeInTheDocument();
  });

  it("renders 'Field' and 'Operator' dropdowns after clicking 'Add Filter'", async () => {
    await user.click(addFilterButton);

    const fieldDropdownInput = screen.getByLabelText("Field");
    const operatorDropdownInput = screen.getByTestId("operator-select");

    expect(fieldDropdownInput).toBeInTheDocument();
    expect(operatorDropdownInput).toBeInTheDocument();

    const filterConfigsWithLookup = filterConfigsWithLookups[0];
    const lookupConfig = filterConfigsWithLookup.lookup;
    const lookupTableName = lookupConfig.table_name;

    const dropdownLabel = lookupConfig.label;
    fireEvent.change(fieldDropdownInput, {
      target: { value: dropdownLabel },
    });

    // fireEvent.change(operatorDropdownInput, {
    //   target: { value: "string_does_not_equal_case_sensitive" },
    // });
    await user.click(operatorDropdownInput);
    // const isOperatorOption = screen.getByText("is");
    // console.log(isOperatorOption);

    // screen.debug();

    // expect(fieldDropdownInput).toBeInTheDocument();
    // expect(operatorDropdownInput).toBeInTheDocument();
  });
});
