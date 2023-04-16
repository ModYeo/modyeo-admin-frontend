import React from "react";
import useInquiryDetail from "../hooks/pages/useInquiryDetail";

import Modal from "../components/commons/Modal";
import {
  Button,
  List,
  ListContainer,
  ModalBackground,
  Title,
} from "../styles/styles";
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
    <ListContainer>
      <Title>Inquiry Detail</Title>
      <br />
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
          <br />
          <SubmitForm
            requiredInputItems={requiredInputItems}
            registerNewElement={registerNewAnswer}
          />
        </>
      ) : (
        <p>정보를 불러오는 중입니다...</p>
      )}
      <Button type="button" onClick={goBackToInquiryListPage}>
        back
      </Button>
      {IS_ANSWER_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleAnswerModificationModal()}>
          <Modal>
            <SubmitForm
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyAnswer}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default InquiryDetail;
