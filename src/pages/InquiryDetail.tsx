import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/commons/Modal";
import routes from "../constants/routes";
import apiManager from "../modules/apiManager";
import { ModalBackground } from "../styles/styles";
import { IAnswer, IDetailedInquiry } from "../type/types";

function InquiryDetail({ inquiryId }: { inquiryId: number }) {
  const navigator = useNavigate();
  const [inquiry, setInquiry] = useState<IDetailedInquiry | null>(null);
  const [targetInquiryIndex, setTargetInquiryIndex] = useState(-1);
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleOnAnswerFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const contentTextAreaValue = contentTextAreaRef.current?.value;
    if (contentTextAreaValue) {
      let isAPICallSuccessful = false;
      if (targetInquiryIndex === -1) {
        // FIX: 응답 데이터가 문의 Id가 아닌 답변 id가 되어야 함.
        const answerId = await apiManager.postNewDataElem(
          routes.server.answer,
          {
            content: contentTextAreaValue,
            inquiryId,
          },
        );
        if (answerId) {
          console.log(answerId);
          // TODO: UI update.
          isAPICallSuccessful = true;
        }
      } else {
        const modifiedAnswerId = await apiManager.modifyData(
          routes.server.answer,
          {
            content: contentTextAreaValue,
            answerId: inquiry?.answerList[targetInquiryIndex].answerId,
          },
        );
        if (modifiedAnswerId && inquiry) {
          const modifiedAnswer: IAnswer = {
            ...inquiry.answerList[targetInquiryIndex],
            content: contentTextAreaValue,
          };
          inquiry?.answerList.splice(targetInquiryIndex, 1, modifiedAnswer);
          setInquiry({ ...inquiry });
          setTargetInquiryIndex(-1);
          isAPICallSuccessful = true;
        }
      }
      if (isAPICallSuccessful) contentTextAreaRef.current.value = "";
    }
  };
  const deleteAnswer = async (answerId: number, index: number) => {
    const confirmAnswerDelete = window.confirm("정말 답변을 삭제하시겠습니까?");
    if (!confirmAnswerDelete) return;
    const isDeleteSuccessful = await apiManager.deleteData(
      routes.server.answer,
      answerId,
    );
    if (isDeleteSuccessful && inquiry) {
      inquiry?.answerList.splice(index, 1);
      setInquiry({ ...inquiry });
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedDetailedInquiry =
        await apiManager.fetchDetailedData<IDetailedInquiry>(
          routes.server.inquiry.index,
          inquiryId,
        );
      if (fetchedDetailedInquiry) setInquiry(fetchedDetailedInquiry);
    })();
  }, [inquiryId]);
  return (
    <div>
      <h5>inquiry detail</h5>
      {inquiry ? (
        <div>
          <p>title - {inquiry.title}</p>
          <p>content - {inquiry.content}</p>
          <p>작성 시간 - {inquiry.createdTime}</p>
          {inquiry.answerList.map((answer, index) => (
            <div key={answer.answerId}>
              <p>answer - {answer.content}</p>
              <p>답변 시간 - {answer.createdTime}</p>
              <button
                type="button"
                onClick={() => setTargetInquiryIndex(index)}
              >
                modify
              </button>
              <button
                type="button"
                onClick={() => deleteAnswer(answer.answerId, index)}
              >
                delete
              </button>
            </div>
          ))}
          <br />
          <form onSubmit={handleOnAnswerFormSubmit}>
            <textarea placeholder="content" ref={contentTextAreaRef} required />
            <button type="submit">submit admin answer</button>
          </form>
        </div>
      ) : (
        <p>정보를 불러오는 중입니다...</p>
      )}
      <button type="button" onClick={() => navigator(routes.client.inquiry)}>
        back
      </button>
      {targetInquiryIndex !== -1 && (
        <ModalBackground onClick={() => setTargetInquiryIndex(-1)}>
          <Modal width={500} height={200}>
            <form onSubmit={handleOnAnswerFormSubmit}>
              <textarea
                placeholder="content"
                ref={contentTextAreaRef}
                defaultValue={inquiry?.answerList[targetInquiryIndex].content}
                required
              />
              <button type="submit">submit admin answer</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
    </div>
  );
}

export default InquiryDetail;