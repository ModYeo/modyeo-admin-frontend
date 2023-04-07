import { useCallback, useRef, useState } from "react";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";

interface INotice {
  content: string;
  id: number;
  imagePath: string;
  title: string;
}

interface INewNotice extends Omit<INotice, "id"> {}

// interface IDetailedNotice extends INotice {
//   createdBy: number;
//   createdDate: Array<number>;
//   updatedBy: number;
//   updatedTime: Array<number>;
//   useYn: "Y" | "N";
// }

const useNotice = () => {
  const [notices, setNotices] = useState<Array<INotice>>([]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const fetchNotices = useCallback(async () => {
    return apiManager.fetchData<INotice>(routes.server.notice);
  }, []);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [titleInputRef.current?.value, contentInputRef.current?.value];
  }, []);

  const initializaNoticesList = useCallback(async () => {
    const fetchedNotices = await fetchNotices();
    if (fetchedNotices) setNotices(fetchedNotices);
  }, [fetchNotices]);

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

  const registerNewAdvertisement = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [titleInputValue, contentInputValue] =
        extractInputValuesFromElementsRef();

      if (titleInputValue && contentInputValue) {
        const newNoticeId = await apiManager.postNewDataElem<INewNotice>(
          routes.server.notice,
          {
            content: contentInputValue,
            imagePath: "",
            title: titleInputValue,
          },
        );
        if (newNoticeId) {
          addNewNoticeInList({
            id: newNoticeId,
            title: titleInputValue,
            content: contentInputValue,
            imagePath: "",
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      addNewNoticeInList,
      initializeInputValues,
    ],
  );

  const removeNoticeInList = useCallback(
    (targetNoticeIndex: number) => {
      setNotices((noticesList) => {
        noticesList.splice(targetNoticeIndex, 1);
        return [...noticesList];
      });
    },
    [setNotices],
  );

  const deleteNotice = async (noticeId: number, targetNoticeIndex: number) => {
    const confirmNoticeDelete = window.confirm("공지를 삭제하시겠습니까?");
    if (!confirmNoticeDelete) return;
    const idDeleteSuccessful = await apiManager.deleteData(
      routes.server.notice,
      noticeId,
    );
    if (idDeleteSuccessful) removeNoticeInList(targetNoticeIndex);
  };

  return {
    notices,
    contentInputRef,
    titleInputRef,
    initializaNoticesList,
    registerNewAdvertisement,

    deleteNotice,
  };
};

export default useNotice;
