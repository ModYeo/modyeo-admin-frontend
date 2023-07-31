import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ObjectType } from "../../components/atoms/Card";

import useSearch from "./useSearch";
import usePagenation from "./usePagenation";

import apiManager from "../../modules/apiManager";

const useTableList = ({
  requestUrl,
  elementTitleKey,
}: {
  requestUrl: string;
  elementTitleKey: string;
}) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const [list, setList] = useState<Array<ObjectType> | null>(null);

  const fetchList = useCallback(() => {
    return apiManager.fetchData<ObjectType>(requestUrl);
  }, [requestUrl]);

  const initializeElementList = useCallback(async () => {
    const fetchedList = await fetchList();
    if (fetchedList) setList(fetchedList.reverse());
  }, [fetchList]);

  const { filteredList, searchInputRef, onSubmitSearchForm } = useSearch(
    elementTitleKey,
    list as unknown as ObjectType[],
  );

  const {
    currentPage,
    currentOffset,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    changePagenation,
    changeOffsetValue,
  } = usePagenation(filteredList?.length);

  const slicedList = useMemo(() => {
    return filteredList?.slice(slicePoint, endOfSlice);
  }, [filteredList, slicePoint, endOfSlice]);

  const goToWritePage = useCallback(() => {
    navigator(`${pathname}/write`);
  }, [pathname, navigator]);

  const goToDetailedPage = useCallback(
    (value: string | number) => {
      navigator(`${pathname}/${value}`);
    },
    [pathname, navigator],
  );

  useEffect(() => {
    initializeElementList();
  }, [initializeElementList]);

  return {
    slicedList,
    filteredListLength: filteredList?.length,
    slicePoint,
    currentPage,
    currentOffset,
    pagenationButtonValues,
    searchInputRef,
    onSubmitSearchForm,
    changeOffsetValue,
    changePagenation,
    goToWritePage,
    goToDetailedPage,
  };
};

export default useTableList;
