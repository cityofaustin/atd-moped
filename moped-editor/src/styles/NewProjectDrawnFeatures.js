/**
 * Global Style Overrides for MapBox Using Styled-Components
 */
import { createGlobalStyle } from "styled-components";

export const NewProjectDrawnPointsInvisibleStyle = createGlobalStyle`
  g > circle { display: none; }
`;

export const NewProjectDrawnLinesInvisibleStyle = createGlobalStyle`
  g > path { display: none; }
`;
