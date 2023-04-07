import { useCallback, useRef, useState } from "react";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

interface ICollection {
  collectionInfoId: number;
  collectionInfoName: string;
  description: string;
  createdBy?: number;
  createdTime?: string;
  updatedBy?: number;
  updatedTime?: string;
}

interface UseCollection {
  collections: Array<ICollection>;
  toBeModifiedCollectionIndex: number;
  collectionInfoNameTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  collectionDescTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  isCollectionBeingModified: boolean;
  initializeAdvertisementsList: () => Promise<void>;
  registerNewCollection: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteCollection: (
    collectionInfoId: number,
    targetCollectionIndex: number,
  ) => Promise<void>;
  toggleCollectionModificationModal: (targetIndex?: number) => void;
  modifyCollection: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useCollection = (): UseCollection => {
  const [collections, setCollections] = useState<Array<ICollection>>([]);

  const [toBeModifiedCollectionIndex, setToBeModifiedCollectionIndex] =
    useState(NOTHING_BEING_MODIFIED);

  const collectionInfoNameTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const collectionDescTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchCollections = useCallback(() => {
    return apiManager.fetchData<ICollection>(routes.server.collection);
  }, []);

  const initializeAdvertisementsList = useCallback(async () => {
    const fetchedCollections = await fetchCollections();
    if (fetchedCollections) setCollections(fetchedCollections.reverse());
  }, [fetchCollections]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [
      collectionInfoNameTextAreaRef.current?.value,
      collectionDescTextAreaRef.current?.value,
    ];
  }, []);

  const initializeInputValues = useCallback(() => {
    const collectionInfoNameCurrent = collectionInfoNameTextAreaRef.current;
    const collectionDescCurrent = collectionDescTextAreaRef.current;
    if (collectionInfoNameCurrent && collectionDescCurrent) {
      collectionInfoNameCurrent.value = "";
      collectionDescCurrent.value = "";
    }
  }, []);

  const addNewCategoryInList = useCallback((newCollection: ICollection) => {
    setCollections((collectionsList) => [newCollection, ...collectionsList]);
  }, []);

  const sendPostCollectionRequest = useCallback(
    <T extends object>(newCollection: T) => {
      return apiManager.postNewDataElem<T>(
        routes.server.collection,
        newCollection,
      );
    },
    [],
  );

  const registerNewCollection = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [infoNameTextAreaValue, descTextAreaValue] =
        extractInputValuesFromElementsRef();

      if (infoNameTextAreaValue && descTextAreaValue) {
        const newCollection: ICollection = {
          collectionInfoId: 0,
          collectionInfoName: infoNameTextAreaValue,
          description: descTextAreaValue,
        };
        const newCollectionId = await sendPostCollectionRequest<ICollection>(
          newCollection,
        );
        if (newCollectionId) {
          initializeInputValues();
          addNewCategoryInList({
            ...newCollection,
            collectionInfoId: newCollectionId,
          });
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      sendPostCollectionRequest,
      initializeInputValues,
      addNewCategoryInList,
    ],
  );

  const sendDeleteCollectionRequest = useCallback(
    (collectionInfoId: number) => {
      return apiManager.deleteData(routes.server.collection, collectionInfoId);
    },
    [],
  );

  const removeCollectionInList = useCallback(
    (targetCollectionIndex: number) => {
      setCollections((collctionsList) => {
        collctionsList.splice(targetCollectionIndex, 1);
        return [...collctionsList];
      });
    },
    [setCollections],
  );

  const deleteCollection = useCallback(
    async (collectionInfoId: number, targetCollectionIndex: number) => {
      const confirmCollectionDelete =
        window.confirm("컬렉션을 삭제하시겠습니까?");
      if (!confirmCollectionDelete) return;
      const isCollectionDeleted = await sendDeleteCollectionRequest(
        collectionInfoId,
      );
      if (isCollectionDeleted) removeCollectionInList(targetCollectionIndex);
    },
    [sendDeleteCollectionRequest, removeCollectionInList],
  );

  const toggleCollectionModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined)
        setToBeModifiedCollectionIndex(targetIndex);
      else setToBeModifiedCollectionIndex(NOTHING_BEING_MODIFIED);
    },
    [],
  );

  const sendPatchCollectionRequest = useCallback(
    <T extends object>(modifiedCollection: T) => {
      return apiManager.modifyData<T>(
        routes.server.collection,
        modifiedCollection,
      );
    },
    [],
  );

  const updateTargetCollection = (modifiedCollection: ICollection) => {
    setCollections((collectionsList) => {
      collectionsList.splice(
        toBeModifiedCollectionIndex,
        1,
        modifiedCollection,
      );
      return [...collectionsList];
    });
  };

  const modifyCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [infoNameTextAreaValue, descTextAreaValue] =
      extractInputValuesFromElementsRef();

    const { collectionInfoId } = collections[toBeModifiedCollectionIndex];

    if (infoNameTextAreaValue && descTextAreaValue) {
      const modifiedCollection = {
        collectionInfoId,
        collectionInfoName: infoNameTextAreaValue,
        description: descTextAreaValue,
      };
      const modifiedCollectionId = await sendPatchCollectionRequest(
        modifiedCollection,
      );
      if (collectionInfoId === modifiedCollectionId) {
        updateTargetCollection(modifiedCollection);
        toggleCollectionModificationModal();
        initializeInputValues();
      }
    }
  };

  const isCollectionBeingModified =
    toBeModifiedCollectionIndex !== NOTHING_BEING_MODIFIED;

  return {
    collections,
    toBeModifiedCollectionIndex,
    collectionInfoNameTextAreaRef,
    collectionDescTextAreaRef,
    isCollectionBeingModified,
    initializeAdvertisementsList,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModal,
    modifyCollection,
  };
};

export default useCollection;
