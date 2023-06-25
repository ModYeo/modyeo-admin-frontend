import React from "react";
import useInquiryDetail from "../hooks/pages/useInquiryDetail";

import Card, { ObjectType } from "../components/atoms/Card";
import ListElement from "../components/molcules/ListElement";
import SubmitForm from "../components/molcules/SubmitForm";

import { Button, List, ListContainer, Title } from "../styles/styles";

function InquiryDetail() {
  const {
    inquiry,
    requiredInputItems,
    goBackToInquiryListPage,
    registerNewAnswer,
    deleteAnswer,
    toggleAnswerModificationModal,
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
    </ListContainer>
  );
}

export default InquiryDetail;
