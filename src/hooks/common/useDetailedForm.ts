/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { RequiredInputItem } from "../../components/atoms/Input";

import apiManager from "../../modules/apiManager";

const useDetailedForm = <T>(
  path: string,
  requiredInputItems: RequiredInputItem[],
) => {
  const { pathname } = useLocation();

  const [detailedData, setDetailedData] = useState<T | null>(null);

  const elementId = useMemo(
    () => pathname.split("/")[2],
    [pathname],
  ) as unknown as number;

  const transformToOriginalItemName = useCallback((itemName: string) => {
    const splitedItemNameChars = itemName.split("");
    splitedItemNameChars.forEach((char, idx) => {
      if (char === " ")
        splitedItemNameChars[idx + 1] =
          splitedItemNameChars[idx + 1].toLocaleUpperCase();
    });
    return splitedItemNameChars.join("").replaceAll(" ", "");
  }, []);

  const makeBlankAheadOfUpperCase = useCallback(
    ([key, value]: [string, unknown]): [string, string] => {
      const blankedKey = key.split("");

      blankedKey.forEach((char, idx) => {
        if (char === char.toLocaleUpperCase()) {
          blankedKey[idx] = char.toLocaleLowerCase();
          blankedKey.splice(idx, 0, " ");
        }
      });

      return [blankedKey.join(""), String(value)];
    },
    [],
  );

  const readOnlyItems = useMemo(() => {
    if (detailedData && detailedData instanceof Object) {
      return Object.entries(detailedData)
        .filter(([key, value]) => {
          const isWritableItem = requiredInputItems.some((inputItem) => {
            const { itemName } = inputItem;

            const originalItemName = transformToOriginalItemName(itemName);

            if (key === originalItemName) {
              console.log(originalItemName, key);
              inputItem.defaultValue = value as string;
              return true;
            }
            return false;
          });

          return !isWritableItem;
        })
        .map(makeBlankAheadOfUpperCase);
    }
  }, [
    requiredInputItems,
    detailedData,
    transformToOriginalItemName,
    makeBlankAheadOfUpperCase,
  ]);

  const fetchDetailedData = useCallback(() => {
    return apiManager.fetchDetailedData<T>(path, elementId);
  }, [path, elementId]);

  const initializeDetailedData = useCallback(async () => {
    const fetchedDetailedData = await fetchDetailedData();
    if (fetchedDetailedData) setDetailedData(fetchedDetailedData);
  }, [fetchDetailedData]);

  useEffect(() => {
    if (Number.isNaN(Number(elementId))) {
      toast.error("Element not found!");
      // TODO: not found item 처리
    } else {
      initializeDetailedData();
    }
  }, [elementId, initializeDetailedData]);

  return {
    detailedData,
    readOnlyItems,
  };
};

export default useDetailedForm;
