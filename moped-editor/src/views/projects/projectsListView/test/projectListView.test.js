import { render, screen, fireEvent, within } from "src/utils/testUtils";
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

const GridTableFiltersWithMockedProps = () => (
  <GridTableFilters
    query={projectsQuery}
    filterState={{ filterParameters: {}, setFilterParameters: () => true }}
    filterQuery={filterQuery}
    history={history}
    handleAdvancedSearchClose={() => true}
  />
);

describe("ProjectListView", () => {
  it("renders the 'Add Filter' button to start filtering by clicking", () => {
    render(<GridTableFiltersWithMockedProps />);

    const addFilterButton = screen.getByText("Add Filter");

    expect(addFilterButton).toBeInTheDocument();
  });

  it("renders 'Field' and 'Operator' dropdowns after clicking 'Add Filter'", async () => {
    const user = userEvent.setup();

    render(<GridTableFiltersWithMockedProps />);

    const addFilterButton = screen.getByText("Add Filter");
    await user.click(addFilterButton);

    const fieldDropdownInput = screen.getByLabelText("Field");
    const operatorDropdownInput = screen.getByTestId("operator-select");

    expect(fieldDropdownInput).toBeInTheDocument();
    expect(operatorDropdownInput).toBeInTheDocument();
  });

  it("renders 'Field' and 'Operator' dropdowns after clicking 'Add Filter'", async () => {
    const user = userEvent.setup();

    render(<GridTableFiltersWithMockedProps />);

    const addFilterButton = screen.getByText("Add Filter");
    await user.click(addFilterButton);

    const fieldDropdownInput = screen.getByLabelText("Field");
    const operatorDropdownInput = screen.getByTestId("operator-select");

    // Find a config that uses a lookup table to find a choice to click
    const filterConfigWithLookup = filterConfigsWithLookups[0];
    const lookupConfig = filterConfigWithLookup.lookup;
    const lookupTableName = lookupConfig.table_name;

    // Click the 'Field' dropdown and click an option that uses a lookup table
    const dropdownLabel = filterConfigWithLookup.label;
    await user.click(fieldDropdownInput);
    const optionWithLookup = screen.getByText(dropdownLabel);

    await user.click(optionWithLookup);
    screen.debug();
    // fireEvent.change(fieldDropdownInput, {
    //   target: { value: dropdownLabel },
    // });

    // console.log(operatorDropdownInput);
    // await user.click(operatorDropdownInput);
    // screen.debug();
    // const optionsPopupEl = screen.getByRole("listbox");
    // console.log(optionsPopupEl);

    // screen.debug();
  });
});
