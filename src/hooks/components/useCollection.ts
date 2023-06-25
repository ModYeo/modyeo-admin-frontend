import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import apiManager from "../../modules/apiManager";

import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

import DAY_FORMAT from "../../constants/dayFormat";
import routes from "../../constants/routes";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";

interface ICollection {
  collectionInfoId: number;
  collectionInfoName: string;
  description: string;
  createdBy: number;
  createdTime: string;
  updatedBy: number;
  updatedTime: string;
}

interface UseCollection {
  collections: Array<ICollection>;
  requiredInputItems: RequiredInputItems;
  registerNewCollection: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteCollection: (
    collectionInfoId: number,
    targetCollectionIndex: number,
  ) => Promise<void>;
  toggleCollectionModificationModal: (targetIndex?: number) => void;
  modifyCollection: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useCollection = (): UseCollection => {
  const {
    isModalVisible,
    closeModalAndInitializeModificationForm,
    injectModificationModels,
  } = useContext(MODAL_CONTEXT);

  const [collections, setCollections] = useState<Array<ICollection>>([]);

  const toBeModifiedCollectionIndex = useRef<number>(NOTHING_BEING_MODIFIED);

  const collectionInfoNameTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const collectionInfoNameModifyTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const collectionDescTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const collectionDescModifyTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchCollections = useCallback(() => {
    return apiManager.fetchData<ICollection>(routes.server.collection);
  }, []);

  const initializeAdvertisementsList = useCallback(async () => {
    const fetchedCollections = await fetchCollections();
    if (fetchedCollections) setCollections(fetchedCollections.reverse());
  }, [fetchCollections]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return toBeModifiedCollectionIndex.current !== NOTHING_BEING_MODIFIED
      ? [
          collectionInfoNameModifyTextAreaRef.current?.value,
          collectionDescModifyTextAreaRef.current?.value,
        ]
      : [
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
        const answerCreatedTime = dayjs().format(DAY_FORMAT);
        const newCollection: ICollection = {
          collectionInfoId: 0,
          collectionInfoName: infoNameTextAreaValue,
          description: descTextAreaValue,
          createdBy: 1,
          createdTime: answerCreatedTime,
          updatedBy: 1,
          updatedTime: answerCreatedTime,
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
        toBeModifiedCollectionIndex.current,
        1,
        modifiedCollection,
      );
      return [...collectionsList];
    });
  };

  const modifyCollection = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [infoNameTextAreaValue, descTextAreaValue] =
        extractInputValuesFromElementsRef();

      const targetCollection = collections[toBeModifiedCollectionIndex.current];
      const { collectionInfoId } = targetCollection;

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
          const answerUpdatedTime = dayjs().format(DAY_FORMAT);
          updateTargetCollection({
            ...targetCollection,
            ...modifiedCollection,
            updatedTime: answerUpdatedTime,
          });
          closeModalAndInitializeModificationForm();
        }
      }
    },
    [
      collections,
      extractInputValuesFromElementsRef,
      sendPatchCollectionRequest,
      closeModalAndInitializeModificationForm,
    ],
  );

  const makeRequiredInputElements = useCallback(
    (targetIndex?: number): RequiredInputItems => {
      return targetIndex !== undefined && targetIndex !== NOTHING_BEING_MODIFIED
        ? [
            {
              itemName: "collection info name",
              refObject: collectionInfoNameModifyTextAreaRef,
              elementType: "textarea",
              defaultValue: collections[targetIndex].collectionInfoName,
            },
            {
              itemName: "description",
              refObject: collectionDescModifyTextAreaRef,
              elementType: "textarea",
              defaultValue: collections[targetIndex].description,
            },
          ]
        : [
            {
              itemName: "collection info name",
              refObject: collectionInfoNameTextAreaRef,
              elementType: "textarea",
              defaultValue: "",
            },
            {
              itemName: "description",
              refObject: collectionDescTextAreaRef,
              elementType: "textarea",
              defaultValue: "",
            },
          ];
    },
    [collections],
  );

  const requiredInputItems = useMemo(
    () => makeRequiredInputElements(),
    [makeRequiredInputElements],
  );

  const toggleCollectionModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined) {
        toBeModifiedCollectionIndex.current = targetIndex;
        const requiredInputElementsParam =
          makeRequiredInputElements(targetIndex);
        injectModificationModels({
          requiredInputElementsParam,
          elementModificationFunctionParam: modifyCollection,
        });
      } else {
        toBeModifiedCollectionIndex.current = NOTHING_BEING_MODIFIED;
        closeModalAndInitializeModificationForm();
      }
    },
    [
      modifyCollection,
      makeRequiredInputElements,
      injectModificationModels,
      closeModalAndInitializeModificationForm,
    ],
  );

  useEffect(() => {
    initializeAdvertisementsList();
  }, [initializeAdvertisementsList]);

  useEffect(() => {
    if (!isModalVisible)
      toBeModifiedCollectionIndex.current = NOTHING_BEING_MODIFIED;
  }, [isModalVisible]);

  return {
    collections,
    requiredInputItems,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModal,
    modifyCollection,
  };
};

export default useCollection;
