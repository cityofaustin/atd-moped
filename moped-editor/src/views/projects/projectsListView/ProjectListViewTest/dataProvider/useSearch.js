import { useState } from "react";

export const useSearch = () => {
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchByOptions, setSearchByOptions] = useState([]);

  return { search, setSearch, searchBy, setSearchBy, searchByOptions };
};
