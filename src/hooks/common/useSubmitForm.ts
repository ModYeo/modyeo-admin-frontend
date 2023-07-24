/* eslint-disable no-param-reassign */
import { useCallback } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";

import apiManager from "../../modules/apiManager";

const useSubmitForm = (
  path: string,
  requiredInputItems: RequiredInputItem[],
) => {
  const sendPostRequest = useCallback(
    async (data: object) => {
      return apiManager.postData(path, data, { isXapiKeyNeeded: true });
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

  const processPostData = useCallback(
    async (data: object) => {
      const newElemId = await sendPostRequest(data);
      if (typeof newElemId === "number") handlePostSuccess();
      else handlePostFailure();
    },
    [sendPostRequest, handlePostSuccess, handlePostFailure],
  );

  const generateFileReader = useCallback(
    (data: Record<string, any>) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const encodedResult = fileReader.result;
        data.imageData = encodedResult;
        data.resource = "image/test.jpg";
        processPostData(data);
      };
      return fileReader;
    },
    [processPostData],
  );

  const assemblePostData = useCallback(
    (
      item: RequiredInputItem,
      data: Record<string, any>,
      isPostReqAlreadySent: {
        value: boolean;
      },
    ) => {
      if (item.elementType === "input") {
        if (
          item.name &&
          item.refObject.current &&
          "value" in item.refObject.current
        ) {
          data[item.name] = item.refObject.current.value;
        }
      } else if (
        item.elementType === "image" &&
        item.refObject.current &&
        "file" in item.refObject.current &&
        item.refObject.current.file
      ) {
        const fileReader = generateFileReader(data);
        fileReader.readAsDataURL(item.refObject.current.file);
        isPostReqAlreadySent.value = true;
      }
    },
    [generateFileReader],
  );

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data: Record<string, any> = {};

      const isPostReqAlreadySent = { value: false };

      requiredInputItems.forEach((item) =>
        assemblePostData(item, data, isPostReqAlreadySent),
      );

      if (!isPostReqAlreadySent.value) await processPostData(data);
    },
    [requiredInputItems, assemblePostData, processPostData],
  );

  return { handleOnSubmit };
};

export default useSubmitForm;
