import { useMemo } from "react";
import { gql } from "apollo-boost";

export const useGetProjectMapView = ({
  columnsToReturn = ["project_id", "project_name", "project_description"],
  projectColumnsToReturn,
  searchWhereString,
  advancedSearchWhereString,
}) => {
  const query = useMemo(() => {
    const queryString = `query ProjectListViewMap {
        project_list_view (
            where: { 
              ${
                searchWhereString && advancedSearchWhereString
                  ? `_and: [{_or: [${searchWhereString}]}, {${advancedSearchWhereString}}]`
                  : ""
              }
              ${
                searchWhereString && !advancedSearchWhereString
                  ? `_or: [${searchWhereString}]`
                  : ""
              }
              ${
                advancedSearchWhereString && !searchWhereString
                  ? advancedSearchWhereString
                  : ""
              }
            }
        ) {
            ${columnsToReturn.join("\n")}
            moped_proj_components(where: { is_deleted: { _eq: false } }) {
              component_id
              feature_drawn_lines {
                geography
              }
              feature_drawn_points {
                geography
              }
              feature_intersections {
                geography
              }
              feature_signals {
                geography
              }
              feature_street_segments {
                geography
              }
            }
        },
        project_list_view_aggregate (
          where: { 
            ${
              searchWhereString && advancedSearchWhereString
                ? `_and: [{_or: [${searchWhereString}]}, {${advancedSearchWhereString}}]`
                : ""
            }
            ${
              searchWhereString && !advancedSearchWhereString
                ? `_or: [${searchWhereString}]`
                : ""
            }
            ${
              advancedSearchWhereString && !searchWhereString
                ? advancedSearchWhereString
                : ""
            }
          }
        ) {
          aggregate {
            count
          }
        }
      }`;
    const query = gql`
      ${queryString}
    `;
    console.log(queryString);

    return query;
  }, [projectColumnsToReturn, searchWhereString, advancedSearchWhereString]);

  return {
    query,
  };
};
