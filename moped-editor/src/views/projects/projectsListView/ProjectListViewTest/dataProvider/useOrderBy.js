import { useState } from "react";

export const useOrderBy = ({
  defaultOrderByColumn = null,
  defaultOrderByDirection = null,
}) => {
  const [orderByColumn, setOrderByColumn] = useState(defaultOrderByColumn);
  const [orderByDirection, setOrderByDirection] = useState(
    defaultOrderByDirection
  );

  return {
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
  };
};
