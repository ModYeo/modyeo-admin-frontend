import { useCallback, useMemo } from "react";
import {
  URLSearchParamsInit,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

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
    return Array.from({ length: pagenationLimit }, (_, i) => i + 1);
  }, [listLength, currentOffset]);

  const [slicePoint, endOfSlice] = useMemo(() => {
    const currentSlicePoint = (currentPage - 1) * currentOffset;
    return [currentSlicePoint, currentSlicePoint + currentOffset];
  }, [currentPage, currentOffset]);

  const changePagenation = useCallback(
    (value: number) => {
      const isFirstPage = value === 1;
      const params: Record<string, string | number> = {};
      if (!isFirstPage) params["page"] = value;
      if (searchParam) params["search"] = searchParam;
      if (currentOffset > 10) params["offset"] = currentOffset;
      navigator({
        pathname,
        search: `${createSearchParams(
          params as unknown as URLSearchParamsInit,
        ).toString()}`,
      });
    },
    [pathname, currentOffset, searchParam, navigator],
  );

  const changeOffsetValue = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      const offset = Number(value);

      const params: Record<string, string | number> = {};

      if (searchParam) params["search"] = searchParam;

      const validatedOffset = checkOffsetValidation(offset);

      if (validatedOffset !== 10) params["offset"] = validatedOffset;

      navigator({
        pathname,
        search: `${createSearchParams(
          params as unknown as URLSearchParamsInit,
        ).toString()}`,
      });
    },
    [pathname, searchParam, navigator, checkOffsetValidation],
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
