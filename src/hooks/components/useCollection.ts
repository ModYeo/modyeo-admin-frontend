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

  const registerNewCollection = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [infoNameTextAreaValue, descTextAreaValue] =
        extractInputValuesFromElementsRef();

      if (infoNameTextAreaValue && descTextAreaValue) {
        const newCollectionId = await apiManager.postNewDataElem<ICollection>(
          routes.server.collection,
          {
            collectionInfoId: 0,
            collectionInfoName: infoNameTextAreaValue,
            description: descTextAreaValue,
          },
        );
        if (newCollectionId) {
          initializeInputValues();
          addNewCategoryInList({
            collectionInfoId: newCollectionId,
            collectionInfoName: infoNameTextAreaValue,
            description: descTextAreaValue,
          });
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      initializeInputValues,
      addNewCategoryInList,
    ],
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
      const isCollectionDeleted = await apiManager.deleteData(
        routes.server.collection,
        collectionInfoId,
      );
      if (isCollectionDeleted) removeCollectionInList(targetCollectionIndex);
    },
    [removeCollectionInList],
  );

  const toggleCollectionModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined)
        setToBeModifiedCollectionIndex(targetIndex);
      else setToBeModifiedCollectionIndex(NOTHING_BEING_MODIFIED);
    },
    [],
  );

  const updateTargetCollection = () => {
    const [infoNameTextAreaValue, descTextAreaValue] =
      extractInputValuesFromElementsRef();

    if (infoNameTextAreaValue && descTextAreaValue) {
      setCollections((collectionsList) => {
        const targetCollection = collectionsList[toBeModifiedCollectionIndex];
        targetCollection.collectionInfoName = infoNameTextAreaValue;
        targetCollection.description = descTextAreaValue;
        return [...collectionsList];
      });
    }
  };

  const modifyCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [infoNameTextAreaValue, descTextAreaValue] =
      extractInputValuesFromElementsRef();

    const { collectionInfoId } = collections[toBeModifiedCollectionIndex];

    if (infoNameTextAreaValue && descTextAreaValue) {
      const modifiedCollectionId = await apiManager.modifyData<ICollection>(
        routes.server.collection,
        {
          collectionInfoId,
          collectionInfoName: infoNameTextAreaValue,
          description: descTextAreaValue,
        },
      );
      if (modifiedCollectionId) {
        updateTargetCollection();
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
