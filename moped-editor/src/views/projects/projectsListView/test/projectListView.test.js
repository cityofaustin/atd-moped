import { render, screen } from "src/utils/testUtils";
import "@testing-library/jest-dom";
import GQLAbstract from "src/libs/GQLAbstract";
import GridTableFilters from "src/components/GridTable/GridTableFilters";
import { ProjectsListViewQueryConf } from "../ProjectsListViewQueryConf";
import { createBrowserHistory } from "history";

// Show DOM in test runner -
screen.debug();

let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);
const filterQuery = new URLSearchParams("");
const history = createBrowserHistory();

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

    expect(addFilterButton).toBeInTheDocument();
  });
});
