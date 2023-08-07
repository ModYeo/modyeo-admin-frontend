import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";

import TOAST_SENTENCES from "../../constants/toastSentences";
import serverStatus from "../../constants/serverStatus";
import routes from "../../constants/routes";

const useDeleteItem = (
  path: string,
  elementId: number,
  option?: { willKeepURLAfterDelete: boolean },
) => {
  const navigator = useNavigate();

  const deleteThisData = useCallback(() => {
    return apiManager.deleteData(path, elementId);
  }, [path, elementId]);

  const handleOnClickDeleteBtn = useCallback(async () => {
    try {
      const isDeleteConfirmed = window.confirm("이 데이터를 삭제하시겠습니까?");
      if (!isDeleteConfirmed) return;
      const isDataDeleteSuccessful = await deleteThisData();
      if (isDataDeleteSuccessful && !option?.willKeepURLAfterDelete) {
        navigator(-1);
        return true;
      }
    } catch (e) {
      const { message, cause } = e as Error;
      toast.error(message || TOAST_SENTENCES.WRONG_IN_SERVER);
      if (cause === serverStatus.UNAUTHORIZED) navigator(routes.client.signin);
      else return false;
    }
  }, [option?.willKeepURLAfterDelete, deleteThisData, navigator]);

  return {
    handleOnClickDeleteBtn,
  };
};

export default useDeleteItem;
