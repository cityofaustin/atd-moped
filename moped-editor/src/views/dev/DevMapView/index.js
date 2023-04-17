import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Page from "src/components/Page";
import { useQuery, gql } from "@apollo/client";
import ProjectsMap from "src/views/projects/projectView/ProjectSummary/ProjectsMap";
export const GET_PROJECT_COMPONENTS = gql`
  query GetProjectGeography {
    moped_project(where: { is_deleted: { _eq: false } }) {
      current_phase_view {
        phase_name
        phase_key
      }
      geography(where: { is_deleted: { _eq: false } }) {
        project_id
        project_name
        proj_component {
          project_component_id
          moped_components {
            component_name
            component_subtype
          }
        }
        attributes
        geometry: geography
      }
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
              <ProjectsMap data={data} />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </ApolloErrorHandler>
  );
};

export default DevMapView;
