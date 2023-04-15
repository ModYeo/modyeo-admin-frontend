import React from "react";
import useInquiryDetail from "../hooks/pages/useInquiryDetail";

import Modal from "../components/commons/Modal";
import { List, ModalBackground } from "../styles/styles";
import Card, { ObjectType } from "../components/atoms/Card";
import ListElement from "../components/molcules/ListElement";
import SubmitForm from "../components/molcules/SubmitForm";

function InquiryDetail() {
  const {
    inquiry,
    requiredInputItems,
    IS_ANSWER_BEING_MODIFIED,
    goBackToInquiryListPage,
    registerNewAnswer,
    deleteAnswer,
    toggleAnswerModificationModal,
    modifyAnswer,
  } = useInquiryDetail();

  return (
    <div>
      <h5>inquiry detail</h5>
      {inquiry ? (
        <>
          <Card element={inquiry as unknown as ObjectType} />
          {inquiry.answerList.map((answer, index) => (
            <List key={answer.answerId}>
              <ListElement
                listElement={answer as unknown as ObjectType}
                elementId={answer.answerId}
                elementIndex={index}
                toggleModificationModal={toggleAnswerModificationModal}
                deleteElement={deleteAnswer}
              />
            </List>
          ))}
          <SubmitForm
            title="admin answer"
            requiredInputItems={requiredInputItems}
            registerNewElement={registerNewAnswer}
          />
        </>
      ) : (
        <p>정보를 불러오는 중입니다...</p>
      )}
      <button type="button" onClick={goBackToInquiryListPage}>
        back
      </button>
      {IS_ANSWER_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleAnswerModificationModal()}>
          <Modal width={500} height={200}>
            <SubmitForm
              title="notices list"
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyAnswer}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )}
    </div>
  );
}

export default InquiryDetail;
