import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const usePagenation = (listLength: number) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const [searchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const offsetParam = Number(searchParams.get("offset"));

  const searchParam = searchParams.get("search");

  const checkOffsetValidation = useCallback(
    (offset: number) => {
      return offset === 10 ||
        offset === 20 ||
        offset === 50 ||
        offset === listLength
        ? offset
        : 10;
    },
    [listLength],
  );

  const currentPage = Number.isInteger(pageParam) ? pageParam || 1 : 1;

  const currentOffset = Number.isInteger(offsetParam)
    ? checkOffsetValidation(offsetParam)
    : 10;

  const pagenationButtonValues = useMemo(() => {
    const pagenationLimit = Math.ceil(listLength / currentOffset);
    if (pagenationLimit <= 5)
      return Array.from({ length: pagenationLimit }, (_, i) => i + 1);
    return [];
  }, [listLength, currentOffset]);

  const [slicePoint, endOfSlice] = useMemo(() => {
    const currentSlicePoint = (currentPage - 1) * currentOffset;
    return [currentSlicePoint, currentSlicePoint + currentOffset];
  }, [currentPage, currentOffset]);

  const changePagenation = useCallback(
    (value: number) => {
      const isFirstPage = value === 1;
      navigator(
        `${pathname}?${searchParam ? `search=${searchParam}` : ""}${
          !isFirstPage ? `page=${value}` : ""
        }${
          currentOffset > 10
            ? `${!isFirstPage ? "&" : ""}offset=${currentOffset}`
            : ""
        }`,
      );
    },
    [pathname, currentOffset, searchParam, navigator],
  );

  const changeOffsetValue = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      const offset = Number(value);
      // TODO: offset validation check
      navigator(
        `${pathname}?${searchParam ? `search=${searchParam}` : ""}${
          searchParam && offset !== 10 ? "&" : ""
        }${offset !== 10 ? `offset=${offset}` : ""}`,
      );
    },
    [pathname, searchParam, navigator],
  );

  return {
    currentPage,
    currentOffset,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    changePagenation,
    changeOffsetValue,
  };
};

export default usePagenation;
