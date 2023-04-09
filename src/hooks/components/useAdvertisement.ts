import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import toastSentences from "../../constants/toastSentences";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

const AD_TYPE = "ARTICLE";

interface IAdvertisement {
  advertisementId: number;
  advertisementName: string;
  imagePath: string;
  type: string;
  urlLink: string;
  useYn: "Y" | "N";
}

interface IDetailedAdvertisement extends IAdvertisement {
  createdBy: number;
  createdDate: Array<number>;
  lastModifiedDate: Array<number>;
  type: string;
  updatedBy: number;
  useYn: "Y" | "N";
}

interface IModifiedAdvertisement
  extends Pick<IAdvertisement, "advertisementName" | "imagePath" | "urlLink"> {
  id: number;
  advertisementType: string;
}

interface INewAdvertisement extends Omit<IModifiedAdvertisement, "id"> {}

interface UseAdvertisement {
  advertisements: Array<IAdvertisement>;
  detailedAdvertisement: IDetailedAdvertisement | null;
  toBeModifiedAdvertisementIndex: number;
  advertisementNameInputRef: React.RefObject<HTMLInputElement>;
  urlLinkInputRef: React.RefObject<HTMLInputElement>;
  IS_ADVERTISEMENT_BEING_MODIFIED: boolean;
  initializeAdvertisementsList: () => Promise<void>;
  registerNewAdvertisement: (
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  deleteAdvertisement: (
    advertisementId: number,
    targetAdvertisementIndex: number,
  ) => Promise<void>;
  fetchDetailedAdvertisement: (advertisementId: number) => Promise<void>;
  hideDetailedAdvertisementModal: () => void;
  toggleAdvertisementModificationModal: (targetIndex?: number) => void;
  modifyAdvertisement: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const urlLinkRegex =
  // eslint-disable-next-line no-useless-escape
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const checkUrlLinkValidation = (urlLink: string) => {
  return urlLinkRegex.test(urlLink);
};

const useAdvertisement = (): UseAdvertisement => {
  const [advertisements, setAdvertisements] = useState<Array<IAdvertisement>>(
    [],
  );

  const [detailedAdvertisement, setDetailedAdvertisement] =
    useState<IDetailedAdvertisement | null>(null);

  const [toBeModifiedAdvertisementIndex, setToBeModifiedAdvertisementIndex] =
    useState(NOTHING_BEING_MODIFIED);

  const advertisementNameInputRef = useRef<HTMLInputElement>(null);

  const urlLinkInputRef = useRef<HTMLInputElement>(null);

  const fetchAdvertisements = useCallback(() => {
    return apiManager.fetchData<IAdvertisement>(routes.server.advertisement);
  }, []);

  const initializeAdvertisementsList = useCallback(async () => {
    const fetchedAdvertisements = await fetchAdvertisements();
    if (fetchedAdvertisements) setAdvertisements(fetchedAdvertisements);
  }, [fetchAdvertisements]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [
      advertisementNameInputRef.current?.value,
      urlLinkInputRef.current?.value,
    ];
  }, []);

  const initializeInputValues = useCallback(() => {
    const advertisementNameCurrent = advertisementNameInputRef.current;
    const urlLinkCurrent = urlLinkInputRef.current;
    if (advertisementNameCurrent && urlLinkCurrent) {
      advertisementNameCurrent.value = "";
      urlLinkCurrent.value = "";
    }
  }, []);

  const sendPostAdvertisementRequest = useCallback(
    <T extends object>(newAdvertisement: T) => {
      return apiManager.postNewDataElem<T>(
        routes.server.advertisement,
        newAdvertisement,
      );
    },
    [],
  );

  const addNewAdvertisementInList = useCallback(
    (newAdvertisement: IAdvertisement) => {
      setAdvertisements((advertisementsList) => [
        newAdvertisement,
        ...advertisementsList,
      ]);
    },
    [],
  );

  const registerNewAdvertisement = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [advertisementNameInputValue, urlLinkInputValue] =
        extractInputValuesFromElementsRef();

      if (advertisementNameInputValue && urlLinkInputValue) {
        if (!checkUrlLinkValidation(urlLinkInputValue)) {
          toast.error(toastSentences.advertisement.urlLinkInvalid);
          return;
        }
        const newAdvertisement = {
          advertisementName: advertisementNameInputValue,
          advertisementType: AD_TYPE,
          urlLink: urlLinkInputValue,
          imagePath: "",
        };
        const advertisementId =
          await sendPostAdvertisementRequest<INewAdvertisement>(
            newAdvertisement,
          );
        if (advertisementId) {
          addNewAdvertisementInList({
            ...newAdvertisement,
            advertisementId,
            useYn: "Y",
            type: AD_TYPE,
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      sendPostAdvertisementRequest,
      addNewAdvertisementInList,
      initializeInputValues,
    ],
  );

  const sendDeleteAdvertisementRequest = useCallback(
    (advertisementId: number) => {
      return apiManager.deleteData(
        routes.server.advertisement,
        advertisementId,
      );
    },
    [],
  );

  const removeAdvertisementInList = useCallback(
    (targetAdvertisementIndex: number) => {
      setAdvertisements((advertisementsList) => {
        advertisementsList.splice(targetAdvertisementIndex, 1);
        return [...advertisementsList];
      });
    },
    [setAdvertisements],
  );

  const deleteAdvertisement = useCallback(
    async (advertisementId: number, targetAdvertisementIndex: number) => {
      const confirmAdvertisementDelete =
        window.confirm("정말 이 광고를 삭제하시겠습니까?");
      if (!confirmAdvertisementDelete) return;
      const isDeleteSuccessful = await sendDeleteAdvertisementRequest(
        advertisementId,
      );
      if (isDeleteSuccessful)
        removeAdvertisementInList(targetAdvertisementIndex);
    },
    [sendDeleteAdvertisementRequest, removeAdvertisementInList],
  );

  const fetchDetailedAdvertisement = useCallback(
    async (advertisementId: number) => {
      const fetchedDetailedAdvertisement =
        await apiManager.fetchDetailedData<IDetailedAdvertisement>(
          routes.server.advertisement,
          advertisementId,
        );
      if (fetchedDetailedAdvertisement)
        setDetailedAdvertisement(fetchedDetailedAdvertisement);
    },
    [],
  );

  const hideDetailedAdvertisementModal = useCallback(() => {
    setDetailedAdvertisement(null);
  }, []);

  const toggleAdvertisementModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined)
        setToBeModifiedAdvertisementIndex(targetIndex);
      else setToBeModifiedAdvertisementIndex(NOTHING_BEING_MODIFIED);
    },
    [],
  );

  const sendPatchAdvertisementRequest = <T extends object>(
    modifiedAdvertisement: T,
  ) => {
    return apiManager.modifyData<T>(
      routes.server.advertisement,
      modifiedAdvertisement,
    );
  };

  const updateTargetAdvertisement = (modifiedAdvertisement: IAdvertisement) => {
    setAdvertisements((advertisementsList) => {
      advertisementsList.splice(
        toBeModifiedAdvertisementIndex,
        1,
        modifiedAdvertisement,
      );
      return [...advertisementsList];
    });
  };

  const modifyAdvertisement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [advertisementNameInputValue, urlLinkInputValue] =
      extractInputValuesFromElementsRef();

    if (advertisementNameInputValue && urlLinkInputValue) {
      if (!checkUrlLinkValidation(urlLinkInputValue)) {
        toast.error(toastSentences.advertisement.urlLinkInvalid);
        return;
      }
      const { advertisementId, type } =
        advertisements[toBeModifiedAdvertisementIndex];
      const modifiedAdvertisement = {
        id: advertisementId,
        advertisementName: advertisementNameInputValue,
        urlLink: urlLinkInputValue,
        advertisementType: AD_TYPE,
        imagePath: "",
      };
      const modifiedAdvertisementId =
        await sendPatchAdvertisementRequest<IModifiedAdvertisement>(
          modifiedAdvertisement,
        );
      if (advertisementId === modifiedAdvertisementId) {
        updateTargetAdvertisement({
          ...modifiedAdvertisement,
          advertisementId: modifiedAdvertisementId,
          type,
          useYn: "Y",
        });
        toggleAdvertisementModificationModal();
        initializeInputValues();
      }
    }
  };

  const IS_ADVERTISEMENT_BEING_MODIFIED =
    toBeModifiedAdvertisementIndex !== NOTHING_BEING_MODIFIED;

  return {
    advertisements,
    detailedAdvertisement,
    toBeModifiedAdvertisementIndex,
    advertisementNameInputRef,
    urlLinkInputRef,
    IS_ADVERTISEMENT_BEING_MODIFIED,
    initializeAdvertisementsList,
    registerNewAdvertisement,
    deleteAdvertisement,
    fetchDetailedAdvertisement,
    hideDetailedAdvertisementModal,
    toggleAdvertisementModificationModal,
    modifyAdvertisement,
  };
};

export default useAdvertisement;
