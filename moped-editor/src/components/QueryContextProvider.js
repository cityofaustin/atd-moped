import { createContext } from "react";

/**
 * this context is used to preserve the most recent project list view `gql` so that it
 * can be refetched in other parts of the App's component tree. Despite what the Apollo
 *  docs say other methods, e.g., refetching a query by name, require that the query
 * itself is still active in a mounted component.
 * This issue seems related:
 * https://github.com/apollographql/apollo-client/issues/5419
 */
const ProjectListViewQueryContext = createContext(null);

export default ProjectListViewQueryContext;
