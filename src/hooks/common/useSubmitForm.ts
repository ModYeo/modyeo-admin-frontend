import { useCallback } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import apiManager from "../../modules/apiManager";

const useSubmitForm = (
  path: string,
  requiredInputItems: RequiredInputItem[],
) => {
  const sendPostRequest = useCallback(
    async (data: object) => {
      return apiManager.postData(path, data);
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
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data: Record<string, any> = {};

      requiredInputItems.forEach((item) => {
        if (item.elementType === "input") {
          if (item.name && item.refObject.current) {
            data[item.name] = item.refObject.current.value;
          }
        }
      });

      const newElemId = await sendPostRequest(data);
      if (typeof newElemId === "number") handlePostSuccess();
      else handlePostFailure();
    },
    [requiredInputItems, sendPostRequest, handlePostSuccess, handlePostFailure],
  );

  return { handleOnSubmit };
};

export default useSubmitForm;
