import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

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
  detailedNotice: IDetailedNotice | null;
  toBeModifiedNoticeIndex: number;
  requiredInputItems: RequiredInputItems;
  IS_NOTICE_BEING_MODIFIED: boolean;
  registerNewNotice: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteNotice: (noticeId: number, targetNoticeIndex: number) => Promise<void>;
  initializeDetailedNotice: (noticeId: number) => Promise<void>;
  hideDetailedNoticeModal: () => void;
  toggleNoticeModificationModal: (targetNoticeIndex?: number) => void;
  modifyNotice: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useNotice = (): UseNotice => {
  const [notices, setNotices] = useState<Array<INotice>>([]);

  const [detailedNotice, setDetailedNotice] = useState<IDetailedNotice | null>(
    null,
  );

  const [toBeModifiedNoticeIndex, setToBeModifiedNoticeIndex] = useState(
    NOTHING_BEING_MODIFIED,
  );

  const IS_NOTICE_BEING_MODIFIED =
    toBeModifiedNoticeIndex !== NOTHING_BEING_MODIFIED;

  const titleInputRef = useRef<HTMLInputElement>(null);

  const titleModifyInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const contentModifyInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems = useMemo((): RequiredInputItems => {
    return [
      {
        itemName: "title",
        refObject: IS_NOTICE_BEING_MODIFIED
          ? titleModifyInputRef
          : titleInputRef,
        elementType: "input",
        defaultValue: IS_NOTICE_BEING_MODIFIED
          ? notices[toBeModifiedNoticeIndex].title
          : "",
      },
      {
        itemName: "content",
        refObject: IS_NOTICE_BEING_MODIFIED
          ? contentModifyInputRef
          : contentInputRef,
        elementType: "input",
        defaultValue: IS_NOTICE_BEING_MODIFIED
          ? notices[toBeModifiedNoticeIndex].content
          : "",
      },
    ];
  }, [IS_NOTICE_BEING_MODIFIED, notices, toBeModifiedNoticeIndex]);

  const fetchNotices = useCallback(async () => {
    return apiManager.fetchData<INotice>(routes.server.notice);
  }, []);

  const initializeNoticesList = useCallback(async () => {
    const fetchedNotices = await fetchNotices();
    if (fetchedNotices) setNotices(fetchedNotices.reverse());
  }, [fetchNotices]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [
      IS_NOTICE_BEING_MODIFIED
        ? titleModifyInputRef.current?.value
        : titleInputRef.current?.value,
      IS_NOTICE_BEING_MODIFIED
        ? contentModifyInputRef.current?.value
        : contentInputRef.current?.value,
    ];
  }, [IS_NOTICE_BEING_MODIFIED]);

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
      if (fetchedDetailedNotice) setDetailedNotice(fetchedDetailedNotice);
    },
    [fetchDetailedNotice],
  );

  const hideDetailedNoticeModal = useCallback(
    () => setDetailedNotice(null),
    [],
  );

  const sendNoticePatchRequest = useCallback(
    <T extends object>(modifiedNotice: T) => {
      return apiManager.modifyData<T>(routes.server.notice, modifiedNotice);
    },
    [],
  );

  const updateNoticesList = (modifiedNotice: INotice) => {
    setNotices((noticesList) => {
      noticesList.splice(toBeModifiedNoticeIndex, 1, modifiedNotice);
      return [...noticesList];
    });
  };

  const toggleNoticeModificationModal = useCallback(
    (targetNoticeIndex?: number) => {
      if (targetNoticeIndex !== undefined)
        setToBeModifiedNoticeIndex(targetNoticeIndex);
      else setToBeModifiedNoticeIndex(NOTHING_BEING_MODIFIED);
    },
    [],
  );

  const modifyNotice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [titleInputValue, contentInputValue] =
      extractInputValuesFromElementsRef();

    const { id: targetNoticeId } = notices[toBeModifiedNoticeIndex];

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
        toggleNoticeModificationModal();
        initializeInputValues();
      }
    }
  };

  useEffect(() => {
    initializeNoticesList();
  }, [initializeNoticesList]);

  return {
    notices,
    detailedNotice,
    toBeModifiedNoticeIndex,
    requiredInputItems,
    IS_NOTICE_BEING_MODIFIED,
    registerNewNotice,
    deleteNotice,
    initializeDetailedNotice,
    hideDetailedNoticeModal,
    toggleNoticeModificationModal,
    modifyNotice,
  };
};

export default useNotice;
export type { INotice };
