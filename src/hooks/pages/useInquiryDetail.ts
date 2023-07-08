import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import apiManager from "../../modules/apiManager";

import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItem } from "../../components/atoms/Input";

import routes from "../../constants/routes";
import DAY_FORMAT from "../../constants/dayFormat";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";

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
  requiredInputItems: RequiredInputItem[];
  goBackToInquiryListPage: () => void;
  registerNewAnswer: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteAnswer: (answerId: number, index: number) => Promise<void>;
  toggleAnswerModificationModal: (targetAnswerIndex?: number) => void;
}

const useInquiryDetail = (): UseInquiryDetail => {
  const {
    isModalVisible,
    closeModalAndInitializeModificationForm,
    injectModificationModels,
  } = useContext(MODAL_CONTEXT);

  const navigator = useNavigate();

  const { pathname } = useLocation();

  const pathElements = useMemo(() => pathname.split("/"), [pathname]);

  const inquiryId = useMemo(
    () => Number(pathElements[pathElements.length - 1]),
    [pathElements],
  );

  const [inquiry, setInquiry] = useState<IDetailedInquiry | null>(null);

  const toBeModifiedAnswerIndex = useRef<number>(NOTHING_BEING_MODIFIED);

  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const contentModifyTextAreaRef = useRef<HTMLTextAreaElement>(null);

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
    return [
      toBeModifiedAnswerIndex.current !== NOTHING_BEING_MODIFIED
        ? contentModifyTextAreaRef.current?.value
        : contentTextAreaRef.current?.value,
    ];
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
          const answerCreatedTime = dayjs().format(DAY_FORMAT);
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
          toBeModifiedAnswerIndex.current,
          1,
          modifiedAnswer,
        );
        return { ...currentInquiry };
      }
      return null;
    });
  };

  const modifyAnswer = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [answerContentInputValue] = extractInputValuesFromElementsRef();

      if (answerContentInputValue && inquiry) {
        const { answerId: targetAnswerId } =
          inquiry.answerList[toBeModifiedAnswerIndex.current];

        const modifiedAnswer = {
          content: answerContentInputValue,
          answerId: targetAnswerId,
        };
        const modifiedAnswerId = await sendPatchAnswerRequest<IModifiedAnswer>(
          modifiedAnswer,
        );
        if (targetAnswerId === modifiedAnswerId) {
          updateTargetCategory({
            ...inquiry.answerList[toBeModifiedAnswerIndex.current],
            ...modifiedAnswer,
          });
          closeModalAndInitializeModificationForm();
        }
      }
    },
    [
      inquiry,
      extractInputValuesFromElementsRef,
      sendPatchAnswerRequest,
      closeModalAndInitializeModificationForm,
    ],
  );

  const makeRequiredInputElements = useCallback(
    (targetIndex?: number): RequiredInputItem[] => {
      const isAnswerModifyAction =
        targetIndex !== undefined && targetIndex !== NOTHING_BEING_MODIFIED;
      return [
        {
          itemName: "admin answer",
          refObject: isAnswerModifyAction
            ? contentModifyTextAreaRef
            : contentTextAreaRef,
          elementType: "textarea",
          defaultValue: isAnswerModifyAction
            ? inquiry?.answerList[toBeModifiedAnswerIndex.current].content || ""
            : "",
        },
      ];
    },
    [inquiry],
  );

  const requiredInputItems = useMemo(
    () => makeRequiredInputElements(),
    [makeRequiredInputElements],
  );

  const toggleAnswerModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined) {
        toBeModifiedAnswerIndex.current = targetIndex;
        const requiredInputElementsParam =
          makeRequiredInputElements(targetIndex);
        injectModificationModels({
          requiredInputElementsParam,
          elementModificationFunctionParam: modifyAnswer,
        });
      } else {
        toBeModifiedAnswerIndex.current = NOTHING_BEING_MODIFIED;
        closeModalAndInitializeModificationForm();
      }
    },
    [
      modifyAnswer,
      makeRequiredInputElements,
      injectModificationModels,
      closeModalAndInitializeModificationForm,
    ],
  );

  useEffect(() => {
    initializeDetailedInquiry();
  }, [initializeDetailedInquiry]);

  useEffect(() => {
    if (!isModalVisible)
      toBeModifiedAnswerIndex.current = NOTHING_BEING_MODIFIED;
  }, [isModalVisible]);

  return {
    inquiry,
    requiredInputItems,
    goBackToInquiryListPage,
    registerNewAnswer,
    deleteAnswer,
    toggleAnswerModificationModal,
  };
};

export default useInquiryDetail;
