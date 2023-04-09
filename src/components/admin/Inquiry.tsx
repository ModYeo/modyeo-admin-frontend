import React, { useEffect } from "react";
import useInquiry from "../../hooks/components/useInquiry";

import { List, ListContainer } from "../../styles/styles";

function Inquiry() {
  const { inquiries, initializeInquiriesList, goToDetailedInquiryPage } =
    useInquiry();

  useEffect(() => {
    initializeInquiriesList();
  }, [initializeInquiriesList]);

  return (
    <ListContainer>
      <h5>관리자 질문</h5>
      <br />
      {inquiries.map((inquiry) => (
        <List key={inquiry.inquiryId}>
          <div>
            <div>auth - {inquiry.authority}</div>
            <div>created by - {inquiry.createdBy}</div>
            <div>created time - {inquiry.createdTime}</div>
            <div>title - {inquiry.title}</div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => goToDetailedInquiryPage(inquiry.inquiryId)}
            >
              about
            </button>
          </div>
        </List>
      ))}
    </ListContainer>
  );
}

export default Inquiry;
