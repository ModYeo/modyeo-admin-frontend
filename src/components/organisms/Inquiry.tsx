import React from "react";
import useInquiry from "../../hooks/components/useInquiry";

import { List, ListContainer } from "../../styles/styles";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";

function Inquiry() {
  const { inquiries, goToDetailedInquiryPage } = useInquiry();

  return (
    <ListContainer>
      <h5>관리자 질문</h5>
      <br />
      {inquiries.map((inquiry, index) => (
        <List key={inquiry.inquiryId}>
          <ListElement
            listElement={inquiry as unknown as ObjectType}
            elementId={inquiry.inquiryId}
            elementIndex={index}
          />
          <button
            type="button"
            onClick={() => goToDetailedInquiryPage(inquiry.inquiryId)}
          >
            more
          </button>
        </List>
      ))}
    </ListContainer>
  );
}

export default Inquiry;
