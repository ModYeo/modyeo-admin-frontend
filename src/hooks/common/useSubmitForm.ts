import { useCallback } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import apiManager from "../../modules/apiManager";

const useSubmitForm = (
  path: string,
  requiredInputItems: RequiredInputItem[],
) => {
  const sendPostRequest = useCallback(
    (formData: FormData) => {
      return apiManager.postNewDataElem(path, formData);
    },
    [path],
  );

  const handlePostSuccess = useCallback(() => {
    //
    console.log("success");
  }, []);

  const handlePostFailure = useCallback(() => {
    //
    console.log("failure");
  }, []);

  const handleOnSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();

      requiredInputItems.forEach((item) => {
        if (item.elementType === "input") {
          if (item.name && item.refObject.current)
            formData.append(item.name, item.refObject.current.value);
        }
      });

      const newElemId = sendPostRequest(formData);
      if (typeof newElemId === "number") handlePostSuccess();
      else handlePostFailure();
    },
    [requiredInputItems, sendPostRequest, handlePostSuccess, handlePostFailure],
  );

  return { handleOnSubmit };
};

export default useSubmitForm;
