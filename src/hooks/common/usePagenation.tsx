import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import routes from "../../constants/routes";

const usePagenation = (listLength: number, reqUrl: string) => {
  const navigator = useNavigate();

  const [searchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const offsetParam = Number(searchParams.get("offset"));

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
        `${reqUrl}?${!isFirstPage ? `page=${value}` : ""}${
          currentOffset > 10
            ? `${!isFirstPage ? "&" : ""}offset=${currentOffset}`
            : ""
        }`,
      );
    },
    [currentOffset, reqUrl, navigator],
  );

  const changeOffsetValue = useCallback(
    (value: number) => {
      navigator(`${reqUrl}${value !== 10 ? `?offset=${value}` : ""}`);
    },
    [reqUrl, navigator],
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
