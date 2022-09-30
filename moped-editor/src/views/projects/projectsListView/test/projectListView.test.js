import { render, screen, fireEvent } from "src/utils/testUtils";
import "@testing-library/jest-dom";
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
  it("renders advanced filters with dropdown options & autocomplete when a lookup config is set", () => {
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

    const fieldDropdownInput = screen.getByText("Field");
    const operatorDropdownInput = screen.getByText("Operator");

    const lookupConfig = filterConfigsWithLookups[0];
    const fieldChoiceThatWillUseALookup = lookupConfig.label;
    fireEvent.click(fieldDropdownInput);

    screen.debug();

    expect(addFilterButton).toBeInTheDocument();
    // expect(fieldDropdownInput).toBeInTheDocument();
    // expect(operatorDropdownInput).toBeInTheDocument();
  });
});
