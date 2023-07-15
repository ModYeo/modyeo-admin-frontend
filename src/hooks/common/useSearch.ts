import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ObjectType } from "../../components/atoms/Card";

const useSearch = (
  targetKey: string,
  reqUrl: string,
  list: ObjectType[] = [],
) => {
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();

  const searchParam = searchParams.get("search");

  const filteredList = useMemo(() => {
    if (searchParam) {
      return list.filter((el) => {
        const target = el[targetKey] as string;
        return target.includes(searchParam);
      });
    }
    return list;
  }, [list, targetKey, searchParam]);

  const onSubmitSearchForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { current: searchInputRefCurrent } = searchInputRef;
      if (searchInputRefCurrent?.value) {
        const { value } = searchInputRefCurrent;
        navigator(`${reqUrl}?search=${value}`);
      } else {
        navigator(reqUrl);
      }
    },
    [reqUrl, navigator],
  );

  const resetFilteredList = useCallback(() => {
    navigator(reqUrl);
  }, [reqUrl, navigator]);

  return {
    filteredList,
    searchedValue,
    searchInputRef,
    onChangeSearchedValue,
    onSubmitSearchForm,
    resetFilteredList,
  };
};

export default useSearch;
