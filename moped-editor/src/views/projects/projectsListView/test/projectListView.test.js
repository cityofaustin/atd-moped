import { render, screen } from "src/utils/testUtils";
import "@testing-library/jest-dom";
import GridTableSearch from "src/components/GridTable/GridTableSearch";
import { ProjectsListViewQueryConf } from "../ProjectsListViewQueryConf";

// Show DOM in test runner - screen.debug();

let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);

describe("StaffListView", () => {
  it("renders a title", () => {
    render(
      <GridTableSearch
        query={projectsQuery}
        searchState={null}
        filterState={null}
        children={null}
        filterQuery={null}
        parentData={null}
        advancedSearchAnchor={null}
        setAdvancedSearchAnchor={null}
      />
    );

    const titleElement = screen.getByText("Staff");

    expect(titleElement).toBeInTheDocument();
  });
});
