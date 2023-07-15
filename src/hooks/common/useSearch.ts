import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useSearch = () => {
  const location = useLocation();

  const navigator = useNavigate();

  const [searchedValue, setSearchedValue] = useState("");

  const onChangeSearchedValue = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      const { pathname } = location;
      if (pathname) navigator(pathname);
      setSearchedValue(value);
    },
    [location, navigator],
  );
  return {
    searchedValue,
    onChangeSearchedValue,
  };
};

export default useSearch;
