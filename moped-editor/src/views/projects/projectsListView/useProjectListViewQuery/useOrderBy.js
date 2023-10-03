import { useState } from "react";

export const useOrderBy = ({
  defaultColumn = null,
  defaultDirection = null,
}) => {
  const [orderByColumn, setOrderByColumn] = useState(defaultColumn);
  const [orderByDirection, setOrderByDirection] = useState(defaultDirection);

  return {
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
  };
};
