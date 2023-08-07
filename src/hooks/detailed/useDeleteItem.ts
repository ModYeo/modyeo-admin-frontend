import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import apiManager from "../../modules/apiManager";

const useDeleteItem = (
  path: string,
  elementId: number,
  option?: { willKeepURLAfterDelete: boolean },
) => {
  const navigator = useNavigate();

  const deleteThisData = useCallback(() => {
    return apiManager.ELEMENT_DELETEData(path, elementId);
  }, [path, elementId]);

  const handleOnClickDeleteBtn = useCallback(async () => {
    const isDeleteConfirmed = window.confirm("이 데이터를 삭제하시겠습니까?");
    if (!isDeleteConfirmed) return;
    const isDataDeleteSuccessful = await deleteThisData();
    if (isDataDeleteSuccessful && !option?.willKeepURLAfterDelete) {
      navigator(-1);
      return true;
    }
  }, [option?.willKeepURLAfterDelete, deleteThisData, navigator]);

  return {
    handleOnClickDeleteBtn,
  };
};

export default useDeleteItem;
