import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Page from "src/components/Page";
import { useQuery, gql } from "@apollo/client";
import ProjectSummaryMap from "src/views/projects/projectView/ProjectSummary/ProjectSummaryMap";
export const GET_PROJECT_COMPONENTS = gql`
  query GetProjectGeography {
    project_geography(where: { is_deleted: { _eq: false } }) {
      project_id
      project_name
      component_id
      component_name
      attributes
      geometry: geography
    }
  }
`;

const DevMapView = () => {
  const { loading, error, data } = useQuery(GET_PROJECT_COMPONENTS, {
    fetchPolicy: "no-cache",
  });

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Moped Dev Map">
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProjectSummaryMap data={data} />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </ApolloErrorHandler>
  );
};

export default DevMapView;
