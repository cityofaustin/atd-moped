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
  it("renders advanced filters with dropdown options & autocomplete when a lookup config is set", async () => {
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

    const addFilterButton = screen.getByText("Add Filter");

    fireEvent.click(addFilterButton);

    const fieldDropdownInput = screen.getByLabelText("Field");
    const operatorDropdownInput = screen.getByTestId("operator-select");

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
    const isOperatorOption = screen.getByText("is");
    console.log(isOperatorOption);

    // screen.debug();

    expect(addFilterButton).toBeInTheDocument();
    // expect(fieldDropdownInput).toBeInTheDocument();
    // expect(operatorDropdownInput).toBeInTheDocument();
  });
});
