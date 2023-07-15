import { useCallback, useEffect, useMemo, useState } from "react";
import apiManager from "../../modules/apiManager";
import useSearch from "./useSearch";
import { ObjectType } from "../../components/atoms/Card";
import usePagenation from "./usePagenation";

const useTableList = <ListElementType>({
  requestUrl,
  elementTitleKey,
}: {
  requestUrl: string;
  elementTitleKey: string;
}) => {
  const [list, setList] = useState<Array<ListElementType>>([]);

  const fetchList = useCallback(() => {
    return apiManager.fetchData<ListElementType>(requestUrl);
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
