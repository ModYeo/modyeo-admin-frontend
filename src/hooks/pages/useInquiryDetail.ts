import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

enum AuthorityEnum {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}

interface IAnswer {
  answerId: number;
  authority: AuthorityEnum.ROLE_ADMIN;
  content: string;
  createdBy: number;
  createdTime: string;
  inquiryId: number;
}

interface INewAnswer extends Pick<IAnswer, "inquiryId" | "content"> {}

interface IModifiedAnswer extends Pick<IAnswer, "answerId" | "content"> {}

interface IDetailedInquiry {
  answerList: Array<IAnswer>;
  content: string;
  createdBy: number;
  createdTime: string;
  id: number;
  title: number;
}

interface UseInquiryDetail {
  inquiry: IDetailedInquiry | null;
  requiredInputItems: RequiredInputItems;
  IS_ANSWER_BEING_MODIFIED: boolean;
  goBackToInquiryListPage: () => void;
  registerNewAnswer: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteAnswer: (answerId: number, index: number) => Promise<void>;
  toggleAnswerModificationModal: (targetAnswerIndex?: number) => void;
  modifyAnswer: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useInquiryDetail = (): UseInquiryDetail => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const pathElements = useMemo(() => pathname.split("/"), [pathname]);

  const inquiryId = useMemo(
    () => Number(pathElements[pathElements.length - 1]),
    [pathElements],
  );

  const [inquiry, setInquiry] = useState<IDetailedInquiry | null>(null);

  const [toBeModifiedAnswerIndex, setToBeModifiedAnswerIndex] = useState(
    NOTHING_BEING_MODIFIED,
  );

  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const IS_ANSWER_BEING_MODIFIED =
    toBeModifiedAnswerIndex !== NOTHING_BEING_MODIFIED;

  const requiredInputItems = useMemo((): RequiredInputItems => {
    return [
      {
        itemName: "admin answer",
        refObject: contentTextAreaRef,
        elementType: "textarea",
        defaultValue: IS_ANSWER_BEING_MODIFIED
          ? inquiry?.answerList[toBeModifiedAnswerIndex].content || ""
          : "",
      },
    ];
  }, [IS_ANSWER_BEING_MODIFIED, inquiry, toBeModifiedAnswerIndex]);

  const goBackToInquiryListPage = useCallback(() => {
    navigator(routes.client.inquiry);
  }, [navigator]);

  const fetchInquiry = useCallback(() => {
    return apiManager.fetchDetailedData<IDetailedInquiry>(
      routes.server.inquiry.index,
      inquiryId,
    );
  }, [inquiryId]);

  const initializeDetailedInquiry = useCallback(async () => {
    const fetchedInquiry = await fetchInquiry();
    if (fetchedInquiry) setInquiry(fetchedInquiry);
    else goBackToInquiryListPage();
  }, [fetchInquiry, goBackToInquiryListPage]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [contentTextAreaRef.current?.value];
  }, []);

  const sendPostAnswerRequest = useCallback(
    <T extends object>(newAnswer: T) => {
      return apiManager.postNewDataElem<T>(routes.server.answer, newAnswer);
    },
    [],
  );

  const addNewAnswerInAnswerList = useCallback(
    (newAnswer: IAnswer) => {
      setInquiry((currentInquiry) => {
        if (currentInquiry) {
          currentInquiry.answerList.push(newAnswer);
          return { ...currentInquiry };
        }
        return null;
      });
    },
    [setInquiry],
  );

  const initializeInputValues = useCallback(() => {
    const answerContentCurrent = contentTextAreaRef.current;
    if (answerContentCurrent) answerContentCurrent.value = "";
  }, []);

  const registerNewAnswer = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [answerContentInputValue] = extractInputValuesFromElementsRef();

      if (answerContentInputValue) {
        const newAnswer = {
          content: answerContentInputValue,
          inquiryId,
        };
        const newAnswerId = await sendPostAnswerRequest<INewAnswer>(newAnswer);
        if (newAnswerId) {
          const answerCreatedTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
          addNewAnswerInAnswerList({
            ...newAnswer,
            answerId: newAnswerId,
            authority: AuthorityEnum.ROLE_ADMIN,
            createdBy: 1,
            createdTime: answerCreatedTime,
          });
          initializeInputValues();
        }
      }
    },
    [
      inquiryId,
      extractInputValuesFromElementsRef,
      addNewAnswerInAnswerList,
      sendPostAnswerRequest,
      initializeInputValues,
    ],
  );

  const sendDeleteAnswerRequest = useCallback((targetAnswerId: number) => {
    return apiManager.deleteData(routes.server.answer, targetAnswerId);
  }, []);

  const removeAnswerInAnswersList = useCallback((targetAnswerIndex: number) => {
    setInquiry((inquiryState) => {
      if (inquiryState) {
        inquiryState.answerList.splice(targetAnswerIndex, 1);
        return { ...inquiryState };
      }
      return null;
    });
  }, []);

  const deleteAnswer = useCallback(
    async (answerId: number, index: number) => {
      const confirmAnswerDelete =
        window.confirm("정말 답변을 삭제하시겠습니까?");
      if (!confirmAnswerDelete) return;
      const isDeleteSuccessful = await sendDeleteAnswerRequest(answerId);
      if (isDeleteSuccessful) removeAnswerInAnswersList(index);
    },
    [sendDeleteAnswerRequest, removeAnswerInAnswersList],
  );

  const sendPatchAnswerRequest = useCallback(
    <T extends object>(modifiedAnswer: T) => {
      return apiManager.modifyData<T>(routes.server.answer, modifiedAnswer);
    },
    [],
  );

  const updateTargetCategory = (modifiedAnswer: IAnswer) => {
    setInquiry((currentInquiry) => {
      if (currentInquiry) {
        currentInquiry.answerList.splice(
          toBeModifiedAnswerIndex,
          1,
          modifiedAnswer,
        );
        return { ...currentInquiry };
      }
      return null;
    });
  };

  const toggleAnswerModificationModal = useCallback(
    (targetAnswerIndex?: number) => {
      if (targetAnswerIndex !== undefined)
        setToBeModifiedAnswerIndex(targetAnswerIndex);
      else setToBeModifiedAnswerIndex(NOTHING_BEING_MODIFIED);
    },
    [setToBeModifiedAnswerIndex],
  );

  const modifyAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [answerContentInputValue] = extractInputValuesFromElementsRef();

    if (answerContentInputValue && inquiry) {
      const { answerId: targetAnswerId } =
        inquiry.answerList[toBeModifiedAnswerIndex];

      const modifiedAnswer = {
        content: answerContentInputValue,
        answerId: targetAnswerId,
      };
      const modifiedAnswerId = await sendPatchAnswerRequest<IModifiedAnswer>(
        modifiedAnswer,
      );
      if (targetAnswerId === modifiedAnswerId) {
        updateTargetCategory({
          ...inquiry.answerList[toBeModifiedAnswerIndex],
          ...modifiedAnswer,
        });
        toggleAnswerModificationModal();
        initializeInputValues();
      }
    }
  };

  useEffect(() => {
    initializeDetailedInquiry();
  }, [initializeDetailedInquiry]);

  return {
    inquiry,
    requiredInputItems,
    IS_ANSWER_BEING_MODIFIED,
    goBackToInquiryListPage,
    registerNewAnswer,
    deleteAnswer,
    toggleAnswerModificationModal,
    modifyAnswer,
  };
};

export default useInquiryDetail;
