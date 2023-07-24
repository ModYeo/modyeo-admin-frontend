import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ObjectType } from "../../components/atoms/Card";

const useSearch = (targetKey: string, list: ObjectType[] = []) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();

  const searchParam = searchParams.get("search");

  const filteredList = useMemo(() => {
    if (searchParam) {
      return list?.filter((el) => {
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
        navigator(`${pathname}?search=${value}`);
      } else {
        navigator(pathname);
      }
    },
    [pathname, navigator],
  );

  return {
    filteredList,
    searchInputRef,
    onSubmitSearchForm,
  };
};

export default useSearch;
