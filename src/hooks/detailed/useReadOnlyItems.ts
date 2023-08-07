/* eslint-disable no-param-reassign */
import { useCallback, useMemo } from "react";
import { RequiredInputItem } from "../../types";

const useReadOnlyItems = (
  data: Record<string, string | number>,
  requiredInputItems: RequiredInputItem[],
) => {
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
    ([key, value]: [string, unknown]): [string, unknown] => {
      const blankedKey = key.split("");

      blankedKey.forEach((char, idx) => {
        if (char === char.toLocaleUpperCase()) {
          blankedKey[idx] = char.toLocaleLowerCase();
          blankedKey.splice(idx, 0, " ");
        }
      });

      return [blankedKey.join(""), value];
    },
    [],
  );

  const readOnlyItems = useMemo(() => {
    if (data && data instanceof Object) {
      return Object.entries(data)
        .filter(([key, value]) => {
          const isWritableItem = requiredInputItems.some((inputItem) => {
            const { itemName } = inputItem;

            const originalItemName = transformToOriginalItemName(itemName);

            if (key === originalItemName) {
              inputItem.defaultValue = value;
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
    data,
    transformToOriginalItemName,
    makeBlankAheadOfUpperCase,
  ]);

  const resetAllItems = useCallback(() => {
    requiredInputItems?.forEach((item) => {
      const originalItemName = transformToOriginalItemName(item.itemName);

      if (data) {
        const copied = { ...data } as Record<string, unknown>;
        Object.keys(copied).forEach((detailedDataKey) => {
          if (detailedDataKey === originalItemName) {
            const {
              refObject: { current: refObjCurrent },
            } = item;

            if (refObjCurrent && "value" in refObjCurrent)
              refObjCurrent.value = copied[detailedDataKey] as string;
          }
        });
      }
    });
  }, [requiredInputItems, data, transformToOriginalItemName]);

  return {
    readOnlyItems,
    resetAllItems,
  };
};

export default useReadOnlyItems;
