import { useCallback, useRef, useState } from "react";
import { ICollection } from "../../type/types";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

interface UseCollection {
  collections: Array<ICollection>;
  toBeModifiedCollectionIndex: number;
  collectionInfoNameTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  collectionDescTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  isCollectionBeingModified: boolean;
  fetchCollections: () => Promise<void>;
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

  const initializeAdvertisementsList = useCallback(
    (collectionsList: Array<ICollection>) => {
      setCollections(collectionsList);
    },
    [],
  );

  const fetchCollections = useCallback(async () => {
    const fetchedCollections = await apiManager.fetchData<ICollection>(
      routes.server.collection,
    );
    if (fetchedCollections)
      initializeAdvertisementsList(fetchedCollections.reverse());
  }, [initializeAdvertisementsList]);

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
        const newCollectionId = await apiManager.postNewDataElem(
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
      const modifiedCollectionId = await apiManager.modifyData<{}>(
        // TODO: 추후에 제네릭에 알맞은 타입 넣어주기.
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
    fetchCollections,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModal,
    modifyCollection,
  };
};

export default useCollection;
