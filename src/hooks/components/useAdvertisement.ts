import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import { toastSentences } from "../../constants/toastSentences";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

interface IAdvertisement {
  advertisementId: number;
  advertisementName: string;
  imagePath: string;
  type: unknown;
  urlLink: string;
  useYn: unknown;
}

interface IDetailedAdvertisement extends IAdvertisement {
  createdBy: number;
  createdDate: Array<number>;
  lastModifiedDate: Array<number>;
  type: "ARTICLE";
  updatedBy: number;
  useYn: "Y" | "N";
}

interface IModifiedAdvertisement
  extends Pick<IAdvertisement, "advertisementName" | "imagePath" | "urlLink"> {
  id: number;
  advertisementType: "ARTICLE";
}

interface INewAdvertisement extends Omit<IModifiedAdvertisement, "id"> {}

interface UseAdvertisement {
  advertisements: Array<IAdvertisement>;
  detailedAdvertisement: IDetailedAdvertisement | null;
  toBeModifiedAdvertisementIndex: number;
  advertisementNameInputRef: React.RefObject<HTMLInputElement>;
  urlLinkInputRef: React.RefObject<HTMLInputElement>;
  isAdvertisementBeingModified: boolean;
  fetchAdvertisements: () => Promise<void>;
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

const AD_TYPE = "ARTICLE";

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
    if (fetchedAdvertisements)
      initializeAdvertisementsList(fetchedAdvertisements);
  }, [initializeAdvertisementsList]);

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
        const advertisementId =
          await apiManager.postNewDataElem<INewAdvertisement>(
            routes.server.advertisement,
            {
              advertisementName: advertisementNameInputValue,
              advertisementType: AD_TYPE,
              imagePath: "",
              urlLink: urlLinkInputValue,
            },
          );
        if (advertisementId) {
          addNewAdvertisementInList({
            advertisementId,
            advertisementName: advertisementNameInputValue,
            urlLink: urlLinkInputValue,
            imagePath: "",
            useYn: null,
            type: null,
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      addNewAdvertisementInList,
      initializeInputValues,
    ],
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

  const updateTargetAdvertisement = () => {
    const [advertisementNameInputValue, urlLinkInputValue] =
      extractInputValuesFromElementsRef();

    if (advertisementNameInputValue && urlLinkInputValue) {
      setAdvertisements((advertisementsList) => {
        const targetAdvertisement =
          advertisementsList[toBeModifiedAdvertisementIndex];
        targetAdvertisement.advertisementName = advertisementNameInputValue;
        targetAdvertisement.urlLink = urlLinkInputValue;
        return [...advertisementsList];
      });
    }
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
      const { advertisementId } =
        advertisements[toBeModifiedAdvertisementIndex];
      const modifiedAdvertisementId =
        await apiManager.modifyData<IModifiedAdvertisement>(
          routes.server.advertisement,
          {
            id: advertisementId,
            advertisementName: advertisementNameInputValue,
            urlLink: urlLinkInputValue,
            advertisementType: AD_TYPE,
            imagePath: "",
          },
        );
      if (modifiedAdvertisementId) {
        updateTargetAdvertisement();
        toggleAdvertisementModificationModal();
        initializeInputValues();
      }
    }
  };

  const isAdvertisementBeingModified =
    toBeModifiedAdvertisementIndex !== NOTHING_BEING_MODIFIED;

  return {
    advertisements,
    detailedAdvertisement,
    toBeModifiedAdvertisementIndex,
    advertisementNameInputRef,
    urlLinkInputRef,
    isAdvertisementBeingModified,
    fetchAdvertisements,
    registerNewAdvertisement,
    deleteAdvertisement,
    fetchDetailedAdvertisement,
    hideDetailedAdvertisementModal,
    toggleAdvertisementModificationModal,
    modifyAdvertisement,
  };
};

export default useAdvertisement;
