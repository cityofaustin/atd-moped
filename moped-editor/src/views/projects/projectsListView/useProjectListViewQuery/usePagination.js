import { useState } from "react";

export const usePagination = ({ defaultLimit = 0, defaultOffset = 0 }) => {
  const [queryLimit, setQueryLimit] = useState(defaultLimit);
  const [queryOffset, setQueryOffset] = useState(defaultOffset);

  return { queryLimit, setQueryLimit, queryOffset, setQueryOffset };
};
