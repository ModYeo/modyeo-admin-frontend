import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";

import useSubmitForm from "./useSubmitForm";
import useReadOnlyItems from "../detailed/useReadOnlyItems";
import useDeleteItem from "../detailed/useDeleteItem";

import TOAST_SENTENCES from "../../constants/toastSentences";
import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

const useDetailedForm = <T>(
  path: string,
  requiredInputItems: RequiredInputItem[],
  method?: "post" | "patch",
) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

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

  const deleteElementInTheDataArray = useCallback(
    (targetAnswerId: number) => {
      setDetailedData((data) => {
        const copied = { ...data } as Record<string, unknown>;
        if (copied instanceof Object) {
          const { answerList } = copied;
          if (Array.isArray(answerList)) {
            answerList.filter((answer) => {
              if (answer instanceof Object && "answerId" in answer) {
                const { answerId } = answer as Record<string, string | number>;
                return answerId !== targetAnswerId;
              }
              return true;
            });
          }
        }
        return copied as T;
      });
    },
    [setDetailedData],
  );

  const { handleOnClickDeleteBtn } = useDeleteItem(path, elementId);

  const { readOnlyItems, resetAllItems } = useReadOnlyItems(
    detailedData as Record<string, string | number>,
    requiredInputItems,
  );

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
        toast.warn(TOAST_SENTENCES.DATA_ID_CANNOT_BE_MODIFIED);
      }
    },
    [checkElementIdIntegrity, handleOnSubmit],
  );

  const fetchDetailedData = useCallback(() => {
    return apiManager.fetchDetailedData<T>(path, elementId);
  }, [path, elementId]);

  const initializeDetailedData = useCallback(async () => {
    const fetchedDetailedData = await fetchDetailedData();
    if (fetchedDetailedData) setDetailedData(fetchedDetailedData);
    else navigator(routes.client.noData);
  }, [navigator, fetchDetailedData]);

  useEffect(() => {
    if (Number.isNaN(Number(elementId))) {
      navigator(routes.client.noData);
    } else {
      initializeDetailedData();
    }
  }, [elementId, navigator, initializeDetailedData]);

  return {
    readOnlyItems,
    resetAllItems,
    handleOnClickDeleteBtn,
    submitModifiedData,
    deleteElementInTheDataArray,
  };
};

export default useDetailedForm;
