import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [list, setList] = useState<Array<ObjectType>>([]);

  const fetchList = useCallback(() => {
    return apiManager.fetchData<ObjectType>(requestUrl);
  }, [requestUrl]);

  const initializeCategoriesList = useCallback(async () => {
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
  } = usePagenation(filteredList.length);

  const slicedList = useMemo(() => {
    return filteredList.slice(slicePoint, endOfSlice);
  }, [filteredList, slicePoint, endOfSlice]);

  useEffect(() => {
    initializeCategoriesList();
  }, [initializeCategoriesList]);

  return {
    slicedList,
    filteredListLength: filteredList.length,
    slicePoint,
    currentPage,
    currentOffset,
    pagenationButtonValues,
    searchInputRef,
    onSubmitSearchForm,
    changeOffsetValue,
    changePagenation,
  };
};

export default useTableList;
