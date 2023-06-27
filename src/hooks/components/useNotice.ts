import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ObjectType } from "../../components/atoms/Card";

import apiManager from "../../modules/apiManager";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

import routes from "../../constants/routes";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";

interface INotice {
  content: string;
  id: number;
  imagePath: string;
  title: string;
}

interface INewNotice extends Omit<INotice, "id"> {}

interface IDetailedNotice extends INotice {
  createdBy: number;
  createdDate: Array<number>;
  updatedBy: number;
  updatedTime: Array<number>;
  useYn: "Y" | "N";
}

interface UseNotice {
  notices: Array<INotice>;
  requiredInputItems: RequiredInputItems;
  registerNewNotice: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteNotice: (noticeId: number, targetNoticeIndex: number) => Promise<void>;
  initializeDetailedNotice: (noticeId: number) => Promise<void>;
  toggleNoticeModificationModal: (targetNoticeIndex?: number) => void;
}

const useNotice = (): UseNotice => {
  const {
    isModalVisible,
    closeModalAndInitializeModificationForm,
    injectModificationModels,
    injectDetailedElement,
  } = useContext(MODAL_CONTEXT);

  const [notices, setNotices] = useState<Array<INotice>>([]);

  const toBeModifiedNoticeIndex = useRef<number>(NOTHING_BEING_MODIFIED);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const titleModifyInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const contentModifyInputRef = useRef<HTMLInputElement>(null);

  const fetchNotices = useCallback(async () => {
    return apiManager.fetchData<INotice>(routes.server.notice);
  }, []);

  const initializeNoticesList = useCallback(async () => {
    const fetchedNotices = await fetchNotices();
    if (fetchedNotices) setNotices(fetchedNotices.reverse());
  }, [fetchNotices]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return toBeModifiedNoticeIndex.current !== NOTHING_BEING_MODIFIED
      ? [
          titleModifyInputRef.current?.value,
          contentModifyInputRef.current?.value,
        ]
      : [titleInputRef.current?.value, contentInputRef.current?.value];
  }, []);

  const initializeInputValues = useCallback(() => {
    const noticeTitleCurrent = titleInputRef.current;
    const noticeContentCurrent = contentInputRef.current;
    if (noticeTitleCurrent && noticeContentCurrent) {
      noticeTitleCurrent.value = "";
      noticeContentCurrent.value = "";
    }
  }, []);

  const addNewNoticeInList = useCallback((newNotice: INotice) => {
    setNotices((noticesList) => [newNotice, ...noticesList]);
  }, []);

  const sendPostNoticeRequest = useCallback(
    async <T extends object>(newNotice: T) => {
      return apiManager.postNewDataElem<T>(routes.server.notice, newNotice);
    },
    [],
  );

  const registerNewNotice = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [titleInputValue, contentInputValue] =
        extractInputValuesFromElementsRef();

      if (titleInputValue && contentInputValue) {
        const newNotice: INewNotice = {
          content: contentInputValue,
          title: titleInputValue,
          imagePath: "",
        };
        const newNoticeId = await sendPostNoticeRequest<INewNotice>(newNotice);
        if (newNoticeId) {
          addNewNoticeInList({ ...newNotice, id: newNoticeId });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      sendPostNoticeRequest,
      addNewNoticeInList,
      initializeInputValues,
    ],
  );

  const sendDeleteNoticeRequest = useCallback((noticeId: number) => {
    return apiManager.deleteData(routes.server.notice, noticeId);
  }, []);

  const removeTargetNoticeInNoticesList = useCallback(
    (targetNoticeIndex: number) => {
      setNotices((noticesList) => {
        noticesList.splice(targetNoticeIndex, 1);
        return [...noticesList];
      });
    },
    [],
  );

  const deleteNotice = useCallback(
    async (noticeId: number, targetNoticeIndex: number) => {
      const confirmNoticeDelete = window.confirm("공지를 삭제하시겠습니까?");
      if (!confirmNoticeDelete) return;
      const idDeleteSuccessful = await sendDeleteNoticeRequest(noticeId);
      if (idDeleteSuccessful)
        removeTargetNoticeInNoticesList(targetNoticeIndex);
    },
    [sendDeleteNoticeRequest, removeTargetNoticeInNoticesList],
  );

  const fetchDetailedNotice = useCallback(async (noticeId: number) => {
    return apiManager.fetchDetailedData<IDetailedNotice>(
      routes.server.notice,
      noticeId,
    );
  }, []);

  const initializeDetailedNotice = useCallback(
    async (noticeId: number) => {
      const fetchedDetailedNotice = await fetchDetailedNotice(noticeId);
      if (fetchedDetailedNotice)
        injectDetailedElement(fetchedDetailedNotice as unknown as ObjectType);
    },
    [fetchDetailedNotice, injectDetailedElement],
  );

  const sendNoticePatchRequest = useCallback(
    <T extends object>(modifiedNotice: T) => {
      return apiManager.modifyData<T>(routes.server.notice, modifiedNotice);
    },
    [],
  );

  const updateNoticesList = (modifiedNotice: INotice) => {
    setNotices((noticesList) => {
      noticesList.splice(toBeModifiedNoticeIndex.current, 1, modifiedNotice);
      return [...noticesList];
    });
  };

  const modifyNotice = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [titleInputValue, contentInputValue] =
        extractInputValuesFromElementsRef();

      const { id: targetNoticeId } = notices[toBeModifiedNoticeIndex.current];

      if (titleInputValue && contentInputValue) {
        const modifiedNotice: INotice = {
          id: targetNoticeId,
          title: titleInputValue,
          content: contentInputValue,
          imagePath: "",
        };
        const modifiedNoticeId = await sendNoticePatchRequest<INotice>(
          modifiedNotice,
        );
        if (targetNoticeId === modifiedNoticeId) {
          updateNoticesList(modifiedNotice);
          closeModalAndInitializeModificationForm();
        }
      }
    },
    [
      notices,
      extractInputValuesFromElementsRef,
      sendNoticePatchRequest,
      closeModalAndInitializeModificationForm,
    ],
  );

  const makeRequiredInputElements = useCallback(
    (targetIndex?: number): RequiredInputItems => {
      const isNoticeModifiyAction =
        targetIndex !== undefined && targetIndex !== NOTHING_BEING_MODIFIED;
      return [
        {
          itemName: "title",
          refObject: isNoticeModifiyAction
            ? titleModifyInputRef
            : titleInputRef,
          elementType: "input",
          defaultValue: isNoticeModifiyAction
            ? notices[toBeModifiedNoticeIndex.current].title
            : "",
        },
        {
          itemName: "content",
          refObject: isNoticeModifiyAction
            ? contentModifyInputRef
            : contentInputRef,
          elementType: "input",
          defaultValue: isNoticeModifiyAction
            ? notices[toBeModifiedNoticeIndex.current].content
            : "",
        },
      ];
    },
    [notices],
  );

  const requiredInputItems = useMemo(
    () => makeRequiredInputElements(),
    [makeRequiredInputElements],
  );

  const toggleNoticeModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined) {
        toBeModifiedNoticeIndex.current = targetIndex;
        const requiredInputElementsParam =
          makeRequiredInputElements(targetIndex);
        injectModificationModels({
          requiredInputElementsParam,
          elementModificationFunctionParam: modifyNotice,
        });
      } else {
        toBeModifiedNoticeIndex.current = NOTHING_BEING_MODIFIED;
        closeModalAndInitializeModificationForm();
      }
    },
    [
      modifyNotice,
      makeRequiredInputElements,
      injectModificationModels,
      closeModalAndInitializeModificationForm,
    ],
  );

  useEffect(() => {
    initializeNoticesList();
  }, [initializeNoticesList]);

  useEffect(() => {
    if (!isModalVisible)
      toBeModifiedNoticeIndex.current = NOTHING_BEING_MODIFIED;
  }, [isModalVisible]);

  return {
    notices,
    requiredInputItems,
    registerNewNotice,
    deleteNotice,
    initializeDetailedNotice,
    toggleNoticeModificationModal,
  };
};

export default useNotice;
export type { INotice };
