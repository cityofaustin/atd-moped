import { gql } from "@apollo/client";

export const INITIAL_QUERY = gql`
  query generic {
    __typedef
  }
`;

export const INITIAL_MUTATION = gql`
  mutation generic {
    __typedef
  }
`;
