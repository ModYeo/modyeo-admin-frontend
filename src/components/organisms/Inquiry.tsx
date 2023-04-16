import React from "react";
import useInquiry from "../../hooks/components/useInquiry";

import { Button, List, ListContainer, Title } from "../../styles/styles";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";

function Inquiry() {
  const { inquiries, goToDetailedInquiryPage } = useInquiry();

  return (
    <ListContainer>
      <Title>Admin Inquiry</Title>
      {inquiries.map((inquiry, index) => (
        <List key={inquiry.inquiryId}>
          <ListElement
            listElement={inquiry as unknown as ObjectType}
            elementId={inquiry.inquiryId}
            elementIndex={index}
          />
          <Button
            type="button"
            onClick={() => goToDetailedInquiryPage(inquiry.inquiryId)}
          >
            more
          </Button>
        </List>
      ))}
    </ListContainer>
  );
}

export default Inquiry;
