import { render, screen } from "src/utils/testUtils";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GQLAbstract from "src/libs/GQLAbstract";
import GridTableFilters from "src/components/GridTable/GridTableFilters";
import { ProjectsListViewQueryConf } from "../ProjectsListViewQueryConf";
import { createBrowserHistory } from "history";

let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);
const filterQuery = new URLSearchParams("");
const history = createBrowserHistory();

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
  it("renders a disabled 'Add Filter' button before a filter is added", () => {
    render(<GridTableFiltersWithMockedProps />);

    const addFilterButton = screen.getByRole("button", { name: "Add Filter" });

    expect(addFilterButton).toBeInTheDocument();
    expect(addFilterButton).toHaveAttribute("disabled");
  });

  it("renders 'Field' and 'Operator' dropdowns on render", () => {
    render(<GridTableFiltersWithMockedProps />);

    const fieldDropdownInput = screen.getByLabelText("Field");
    const operatorDropdownInput = screen.getByTestId("operator-select");

    expect(fieldDropdownInput).toBeInTheDocument();
    expect(operatorDropdownInput).toBeInTheDocument();
  });

  it("renders returned results from lookup table in 'Option' dropdown", async () => {
    const user = userEvent.setup();

    render(<GridTableFiltersWithMockedProps />);

    // Click the 'Field' dropdown and click an option that uses a lookup table
    await user.click(screen.getByLabelText("Field"));
    await user.click(screen.getByText("Project type"));

    // Click the 'Operator' dropdown and click 'is' option
    await user.click(
      screen.getByRole("button", {
        name: /operator/i,
      })
    );
    await user.click(screen.getByRole("option", { name: "is" }));

    // Click the 'Option' dropdown to show lookup results
    await user.click(screen.getByLabelText("Option"));
    const autocompleteOption = screen.getByRole("option", {
      name: "this is an option",
    });
    const autocompleteOptions = screen.getAllByRole("option");

    expect(autocompleteOption).toBeInTheDocument();
    expect(autocompleteOptions.length).toBeGreaterThan(0);
  });
});
