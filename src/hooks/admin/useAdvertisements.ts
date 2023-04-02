import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import { IAdvertisement, IDetailedAdvertisement } from "../../type/types";
import { toastSentences } from "../../constants/toastSentences";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

const AD_TYPE = "ARTICLE";

const urlLinkRegex =
  // eslint-disable-next-line no-useless-escape
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const checkUrlLinkValidation = (urlLink: string) => {
  return urlLinkRegex.test(urlLink);
};

interface UseAdvertisements {
  advertisements: Array<IAdvertisement>;
  detailedAdvertisement: IDetailedAdvertisement | null;
  toBeModifiedAdvertisementIndex: number;
  advertisementNameInputRef: React.RefObject<HTMLInputElement>;
  urlLinkInputRef: React.RefObject<HTMLInputElement>;
  initializeAdvertisementsList: (
    advertisementsList: Array<IAdvertisement>,
  ) => void;
  fetchAdvertisements: () => Promise<IAdvertisement[] | null>;
  registerNewAdvertisement: (
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  deleteAdvertisement: (
    advertisementId: number,
    targetAdvertisementIndex: number,
  ) => Promise<void>;
  fetchDetailedAdvertisement: (advertisementId: number) => Promise<void>;
  hideDetailedAdvertisementModal: () => void;
  showAdvertisementModificationModal: (targetIndex: number) => void;
  hideAdvertisementModificationModal: () => void;
  modifyAdvertisement: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useAdvertisements = (): UseAdvertisements => {
  const [advertisements, setAdvertisements] = useState<Array<IAdvertisement>>(
    [],
  );

  const [detailedAdvertisement, setDetailedAdvertisement] =
    useState<IDetailedAdvertisement | null>(null);

  const [toBeModifiedAdvertisementIndex, setToBeModifiedAdvertisementIndex] =
    useState(NOTHING_BEING_MODIFIED);

  const advertisementNameInputRef = useRef<HTMLInputElement>(null);

  const urlLinkInputRef = useRef<HTMLInputElement>(null);

  const initializeAdvertisementsList = useCallback(
    (advertisementsList: Array<IAdvertisement>) => {
      setAdvertisements(advertisementsList);
    },
    [],
  );

  const fetchAdvertisements = useCallback(async () => {
    const fetchedAdvertisements = await apiManager.fetchData<IAdvertisement>(
      routes.server.advertisement,
    );
    return fetchedAdvertisements;
  }, []);

  const addNewAdvertisementInList = useCallback(
    (newAdvertisement: IAdvertisement) => {
      setAdvertisements((advertisementsList) => [
        newAdvertisement,
        ...advertisementsList,
      ]);
    },
    [],
  );

  const initializeInputValues = useCallback(() => {
    const advertisementNameInputValue =
      advertisementNameInputRef.current?.value;
    const urlLinkInputValue = urlLinkInputRef.current?.value;

    if (advertisementNameInputValue && urlLinkInputValue) {
      advertisementNameInputRef.current.value = "";
      urlLinkInputRef.current.value = "";
    }
  }, []);

  const registerNewAdvertisement = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const advertisementNameInputValue =
        advertisementNameInputRef.current?.value;
      const urlLinkInputValue = urlLinkInputRef.current?.value;

      if (advertisementNameInputValue && urlLinkInputValue) {
        if (!checkUrlLinkValidation(urlLinkInputValue)) {
          toast.error(toastSentences.advertisement.urlLinkInvalid);
          return;
        }
        const advertisementId = await apiManager.postNewDataElem(
          routes.server.advertisement,
          {
            advertisementName: advertisementNameInputValue,
            advertisementType: AD_TYPE,
            imagePath: "",
            urlLink: urlLinkInputValue,
          },
        );
        if (advertisementId) {
          initializeInputValues();
          addNewAdvertisementInList({
            advertisementId,
            advertisementName: advertisementNameInputValue,
            urlLink: urlLinkInputValue,
            imagePath: "",
            useYn: null,
            type: null,
          });
        }
      }
    },
    [addNewAdvertisementInList, initializeInputValues],
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
      const isDeleteSuccessful = await apiManager.deleteData(
        routes.server.advertisement,
        advertisementId,
      );
      if (isDeleteSuccessful)
        removeAdvertisementInList(targetAdvertisementIndex);
    },
    [removeAdvertisementInList],
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

  const hideDetailedAdvertisementModal = () => {
    setDetailedAdvertisement(null);
  };

  const showAdvertisementModificationModal = useCallback(
    (targetIndex: number) => {
      setToBeModifiedAdvertisementIndex(targetIndex);
    },
    [],
  );

  const hideAdvertisementModificationModal = () => {
    setToBeModifiedAdvertisementIndex(NOTHING_BEING_MODIFIED);
  };

  const modifyTargetAdvertisementInList = (
    modifiedAdvertisementName: string,
    modifiedUrlLink: string,
  ) => {
    setAdvertisements((advertisementsList) => {
      const targetAdvertisement =
        advertisementsList[toBeModifiedAdvertisementIndex];
      targetAdvertisement.advertisementName = modifiedAdvertisementName;
      targetAdvertisement.urlLink = modifiedUrlLink;
      return [...advertisementsList];
    });
  };

  const modifyAdvertisement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const advertisementNameInputValue =
      advertisementNameInputRef.current?.value;
    const urlLinkInputValue = urlLinkInputRef.current?.value;

    if (advertisementNameInputValue && urlLinkInputValue) {
      if (!checkUrlLinkValidation(urlLinkInputValue)) {
        toast.error(toastSentences.advertisement.urlLinkInvalid);
        return;
      }
      const modifiedAdvertisementId = await apiManager.modifyData(
        routes.server.advertisement,
        {
          id: advertisements[toBeModifiedAdvertisementIndex].advertisementId,
          advertisementName: advertisementNameInputValue,
          urlLink: urlLinkInputValue,
          advertisementType: AD_TYPE,
          imagePath: "",
        },
      );
      if (modifiedAdvertisementId) {
        initializeInputValues();
        modifyTargetAdvertisementInList(
          advertisementNameInputValue,
          urlLinkInputValue,
        );
        setToBeModifiedAdvertisementIndex(NOTHING_BEING_MODIFIED);
      }
    }
  };

  return {
    advertisements,
    detailedAdvertisement,
    toBeModifiedAdvertisementIndex,
    advertisementNameInputRef,
    urlLinkInputRef,
    initializeAdvertisementsList,
    fetchAdvertisements,
    registerNewAdvertisement,
    deleteAdvertisement,
    fetchDetailedAdvertisement,
    hideDetailedAdvertisementModal,
    showAdvertisementModificationModal,
    hideAdvertisementModificationModal,
    modifyAdvertisement,
  };
};

export default useAdvertisements;
