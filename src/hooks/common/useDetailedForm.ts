/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { RequiredInputItem } from "../../components/atoms/Input";

import apiManager from "../../modules/apiManager";

import toastSentences from "../../constants/toastSentences";
import useSubmitForm from "./useSubmitForm";

const useDetailedForm = <T>(
  path: string,
  requiredInputItems: RequiredInputItem[],
  method?: "post" | "patch",
) => {
  const { pathname } = useLocation();

  const navigator = useNavigate();

  const { handleOnSubmit } = useSubmitForm(
    path,
    requiredInputItems,
    method || "patch",
  );

  const [detailedData, setDetailedData] = useState<T | null>(null);

  const elementId = useMemo(
    () => pathname.split("/")[2],
    [pathname],
  ) as unknown as number;

  const checkElementIdIntegrity = useCallback(() => {
    return requiredInputItems.some(
      (item) =>
        item.isPrimary &&
        item.refObject.current instanceof HTMLInputElement &&
        item.refObject.current.value === String(elementId),
    );
  }, [requiredInputItems, elementId]);

  const submitModifiedData = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isElementIdNotModified = checkElementIdIntegrity();

      if (isElementIdNotModified) {
        handleOnSubmit(e);
      } else {
        toast.warn(toastSentences.DATA_ID_CANNOT_BE_MODIFIED);
      }
    },
    [checkElementIdIntegrity, handleOnSubmit],
  );

  const deleteThisData = useCallback(() => {
    return apiManager.deleteData(path, elementId);
  }, [path, elementId]);

  const handleOnClickDeleteBtn = useCallback(async () => {
    // TODO: 자체 모달로 교체
    const isDeleteConfirmed = window.confirm("이 데이터를 삭제하시겠습니까?");
    if (!isDeleteConfirmed) return;
    const isDataDeleteSuccessful = await deleteThisData();
    if (isDataDeleteSuccessful) navigator(-1);
  }, [deleteThisData, navigator]);

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
    if (detailedData && detailedData instanceof Object) {
      return Object.entries(detailedData)
        .filter(([key, value]) => {
          const isWritableItem = requiredInputItems.some((inputItem) => {
            const { itemName } = inputItem;

            const originalItemName = transformToOriginalItemName(itemName);

            if (key === originalItemName) {
              inputItem.defaultValue = value as string | number;
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

  const resetAllItems = useCallback(() => {
    requiredInputItems?.forEach((item) => {
      const originalItemName = transformToOriginalItemName(item.itemName);

      if (detailedData) {
        const copied = { ...detailedData } as Record<string, unknown>;
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
  }, [requiredInputItems, detailedData, transformToOriginalItemName]);

  const fetchDetailedData = useCallback(() => {
    return apiManager.fetchDetailedData<T>(path, elementId);
  }, [path, elementId]);

  const initializeDetailedData = useCallback(async () => {
    const fetchedDetailedData = await fetchDetailedData();
    if (fetchedDetailedData) setDetailedData(fetchedDetailedData);
    else {
      // TODO: 예외처리하기
      toast.error("데이터를 찾을 수 없습니다.");
    }
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
    readOnlyItems,
    resetAllItems,
    handleOnClickDeleteBtn,
    submitModifiedData,
  };
};

export default useDetailedForm;
