import { useCallback, useMemo, useState } from "react";

const usePagenation = (listLength: number) => {
  const [pagenation, setPagenation] = useState(0);

  const [offsetValue, setOffsetValue] = useState(10);

  const pagenationButtonValues = useMemo(() => {
    const pagenationLimit = Math.ceil(listLength / offsetValue);
    return Array.from({ length: pagenationLimit }, (_, i) => i + 1);
  }, [listLength, offsetValue]);

  const [slicePoint, endOfSlice] = useMemo(() => {
    const currentSlicePoint = pagenation * offsetValue;
    return [currentSlicePoint, currentSlicePoint + offsetValue];
  }, [pagenation, offsetValue]);

  const chosePagenation = useCallback(
    (value: number) => {
      setPagenation(value);
    },
    [setPagenation],
  );

  const choseSlicePagePerValue = useCallback((sliceValue: number) => {
    setOffsetValue(sliceValue);
    setPagenation(0);
  }, []);

  return {
    pagenation,
    offsetValue,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    chosePagenation,
    choseSlicePagePerValue,
  };
};

export default usePagenation;
