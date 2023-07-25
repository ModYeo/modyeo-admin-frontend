/* eslint-disable no-param-reassign */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { RequiredInputItem } from "../../components/atoms/Input";

import apiManager from "../../modules/apiManager";

const useSubmitForm = (
  path: string,
  requiredInputItems: RequiredInputItem[],
) => {
  const navigator = useNavigate();

  const sendPostRequest = useCallback(
    async (data: object) => {
      return apiManager.postData(path, data, { isXapiKeyNeeded: true });
    },
    [path],
  );

  const handlePostSuccess = useCallback(() => {
    // go to detailed page that just posted.
    navigator("/");
  }, [navigator]);

  const processWithPostData = useCallback(
    async (data: object) => {
      const newElemId = await sendPostRequest(data);
      if (typeof newElemId === "number") handlePostSuccess();
    },
    [sendPostRequest, handlePostSuccess],
  );

  const generateFileReader = useCallback(
    (data: Record<string, any>) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const encodedResult = fileReader.result;
        data.imageData = encodedResult;
        data.resource = "image/test.jpg";
        processWithPostData(data);
      };
      return fileReader;
    },
    [processWithPostData],
  );

  const assemblePostData = useCallback(
    (
      item: RequiredInputItem,
      data: Record<string, any>,
      isPostReqAlreadySent: {
        value: boolean;
      },
    ) => {
      // TODO: delete property key optional
      if (
        item.elementType === "input" &&
        item.name &&
        item.refObject.current &&
        "value" in item.refObject.current
      ) {
        data[item.name] = item.refObject.current.value;
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

      // TODO: check required element
      requiredInputItems.forEach((item) =>
        assemblePostData(item, data, isPostReqAlreadySent),
      );

      if (!isPostReqAlreadySent.value) await processWithPostData(data);
    },
    [requiredInputItems, assemblePostData, processWithPostData],
  );

  return { handleOnSubmit };
};

export default useSubmitForm;
