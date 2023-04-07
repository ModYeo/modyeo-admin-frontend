import { useCallback, useRef, useState } from "react";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

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
  contentInputRef: React.RefObject<HTMLInputElement>;
  titleInputRef: React.RefObject<HTMLInputElement>;
  IS_NOTICE_BEING_MODIFIED: boolean;
  initializaNoticesList: () => Promise<void>;
  registerNewAdvertisement: (
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
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

  const [toBeModifiedNoticeIndex, setToBoModifiedNoticeIndex] = useState(
    NOTHING_BEING_MODIFIED,
  );

  const titleInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const fetchNotices = useCallback(async () => {
    return apiManager.fetchData<INotice>(routes.server.notice);
  }, []);

  const initializaNoticesList = useCallback(async () => {
    const fetchedNotices = await fetchNotices();
    if (fetchedNotices) setNotices(fetchedNotices.reverse());
  }, [fetchNotices]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [titleInputRef.current?.value, contentInputRef.current?.value];
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

  const sendPostNoticeRequest = useCallback(async (newNotice: INewNotice) => {
    return apiManager.postNewDataElem<INewNotice>(
      routes.server.notice,
      newNotice,
    );
  }, []);

  const registerNewAdvertisement = useCallback(
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
        const newNoticeId = await sendPostNoticeRequest(newNotice);
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

  const sendNoticePatchRequest = useCallback((modifiedNotice: INotice) => {
    return apiManager.modifyData<INotice>(routes.server.notice, modifiedNotice);
  }, []);

  const updateNoticesList = (modifiedNotice: INotice) => {
    setNotices((noticesList) => {
      noticesList.splice(toBeModifiedNoticeIndex, 1, modifiedNotice);
      return [...noticesList];
    });
  };

  const toggleNoticeModificationModal = useCallback(
    (targetNoticeIndex?: number) => {
      if (targetNoticeIndex !== undefined)
        setToBoModifiedNoticeIndex(targetNoticeIndex);
      else setToBoModifiedNoticeIndex(NOTHING_BEING_MODIFIED);
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
      const modifiedNoticeId = await sendNoticePatchRequest(modifiedNotice);
      if (targetNoticeId === modifiedNoticeId) {
        updateNoticesList(modifiedNotice);
        toggleNoticeModificationModal();
        initializeInputValues();
      }
    }
  };

  const IS_NOTICE_BEING_MODIFIED =
    toBeModifiedNoticeIndex !== NOTHING_BEING_MODIFIED;

  return {
    notices,
    detailedNotice,
    toBeModifiedNoticeIndex,
    contentInputRef,
    titleInputRef,
    IS_NOTICE_BEING_MODIFIED,
    initializaNoticesList,
    registerNewAdvertisement,
    deleteNotice,
    initializeDetailedNotice,
    hideDetailedNoticeModal,
    toggleNoticeModificationModal,
    modifyNotice,
  };
};

export default useNotice;
