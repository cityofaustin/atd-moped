import { useState } from "react";

export const usePagination = () => {
  const [queryLimit, setQueryLimit] = useState(250);
  const [queryOffset, setQueryOffset] = useState(0);

  return { queryLimit, setQueryLimit, queryOffset, setQueryOffset };
};
