/* eslint-disable no-param-reassign */
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";

import TOAST_SENTENCES from "../../constants/toastSentences";
import SERVER_STATUS from "../../constants/serverStatus";
import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";
import imageSendManager from "../../modules/imageSendManager";

const useSubmitForm = (
  path: string,
  requiredInputItems: RequiredInputItem[],
  method: "post" | "patch",
) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const sendPostRequest = useCallback(
    async (data: object) => {
      return apiManager.postData(path, data);
    },
    [path],
  );

  const sendPatchRequest = useCallback(
    async (data: object) => {
      return apiManager.patchData(path, data);
    },
    [path],
  );

  const handleRequestSuccess = useCallback(
    (newElemId?: number) => {
      if (method === "post") {
        toast.info(TOAST_SENTENCES.REGISTRATION_SUCCESS);
        if (newElemId)
          navigator(`${pathname.replace("/write", "")}/${newElemId}`);
        else navigator(-1);
      }
      if (method === "patch") toast.info(TOAST_SENTENCES.MODIFICATION_SUCCESS);
    },
    [method, pathname, navigator],
  );

  const checkInvalidDataValue = useCallback((data: object) => {
    return Object.entries(data).some(
      ([key, value]) => key !== "imageData" && !value,
    );
  }, []);

  const processWithPostData = useCallback(
    async (data: object) => {
      if (checkInvalidDataValue(data)) {
        toast.warn(TOAST_SENTENCES.FORM_NOT_FULLFILLED);
        return;
      }

      try {
        if (method === "post") {
          const newElemId = await sendPostRequest(data);
          if (typeof newElemId === "number") handleRequestSuccess(newElemId);
        } else if (method === "patch") {
          const modifieElemId = await sendPatchRequest(data);
          if (typeof modifieElemId === "number") handleRequestSuccess();
        }
      } catch (e) {
        const { message, cause } = e as Error;
        toast.error(message || TOAST_SENTENCES.WRONG_IN_SERVER);
        if (cause === SERVER_STATUS.UNAUTHORIZED)
          navigator(routes.client.signin);
      }
    },
    [
      method,
      navigator,
      checkInvalidDataValue,
      sendPostRequest,
      sendPatchRequest,
      handleRequestSuccess,
    ],
  );

  const generateFileReader = useCallback(
    (data: Record<string, any>) => {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const encodedResult = fileReader.result;

        const imagePath = await imageSendManager.sendImageToBucket({
          imageData: encodedResult as string,
          resource: `${pathname}-${Date.now()}.jpg`.replace("/", ""),
        });

        data.imagePath = imagePath;
      };
      return fileReader;
    },
    [pathname],
  );

  const assemblePostData = useCallback(
    (item: RequiredInputItem, data: Record<string, any>) => {
      if (
        item.elementType === "input" &&
        item.refObject.current &&
        "value" in item.refObject.current
      ) {
        data[item.name] = item.refObject.current.value;
      } else if (
        item.elementType === "textarea" &&
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
      }
    },
    [generateFileReader],
  );

  const handleOnSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data: Record<string, any> = {};

      requiredInputItems.forEach((item) => assemblePostData(item, data));

      // TODO: 프로미스로 교체
      setTimeout(async () => {
        await processWithPostData(data);
      }, 3000);
    },
    [requiredInputItems, assemblePostData, processWithPostData],
  );

  return { handleOnSubmit };
};

export default useSubmitForm;
