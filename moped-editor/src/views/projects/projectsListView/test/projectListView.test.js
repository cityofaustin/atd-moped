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

  it("renders returned results from lookup table in 'Option' dropdown", async () => {
    const user = userEvent.setup();

    render(<GridTableFiltersWithMockedProps />);

    const addFilterButton = screen.getByText("Add Filter");
    await user.click(addFilterButton);

    // Click the 'Field' dropdown and click an option that uses a lookup table
    await user.click(screen.getByLabelText("Field"));
    const optionWithLookup = screen.getByText("Project type");
    await user.click(optionWithLookup);

    // Click the 'Operator' dropdown and click 'is' option
    await user.click(
      screen.getByRole("button", {
        name: /operator/i,
      })
    );
    const isOperatorListItem = screen.getByRole("option", { name: "is" });
    await user.click(isOperatorListItem);

    // Click the 'Option' dropdown and click first mocked option
    await user.click(screen.getByLabelText("Option"));
    const autocompleteOption = screen.getByRole("option", {
      name: "this is an option",
    });
    const autocompleteOptions = screen.getAllByRole("option");

    expect(autocompleteOption).toBeInTheDocument();
    expect(autocompleteOptions.length).toBe(2);
  });
});
