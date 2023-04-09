import React, { useEffect } from "react";
import useInquiryDetail from "../hooks/pages/useInquiryDetail";

import Modal from "../components/commons/Modal";
import { ModalBackground } from "../styles/styles";

function InquiryDetail() {
  const {
    inquiry,
    toBeModifiedAnswerIndex,
    contentTextAreaRef,
    IS_ANSWER_BEING_MODIFIED,
    goBackToInquiryListPage,
    initializeDetailedInquiry,
    registerNewAnswer,
    deleteAnswer,
    toggleAnswerModificationModal,
    modifyAnswer,
  } = useInquiryDetail();

  useEffect(() => {
    initializeDetailedInquiry();
  }, [initializeDetailedInquiry]);

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
                onClick={() => toggleAnswerModificationModal(index)}
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
          <form onSubmit={registerNewAnswer}>
            <textarea placeholder="content" ref={contentTextAreaRef} required />
            <button type="submit">submit admin answer</button>
          </form>
        </div>
      ) : (
        <p>정보를 불러오는 중입니다...</p>
      )}
      <button type="button" onClick={goBackToInquiryListPage}>
        back
      </button>
      {IS_ANSWER_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleAnswerModificationModal()}>
          <Modal width={500} height={200}>
            <form onSubmit={modifyAnswer}>
              <textarea
                placeholder="content"
                ref={contentTextAreaRef}
                defaultValue={
                  inquiry?.answerList[toBeModifiedAnswerIndex].content
                }
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
