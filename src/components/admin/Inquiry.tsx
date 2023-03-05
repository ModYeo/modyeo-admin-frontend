import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import { List, ListContainer } from "../../styles/styles";
import { ChosenTabMenuEnum } from "../../type/enums";
import { IInquiry } from "../../type/types";

function Inquiry() {
  const navigator = useNavigate();
  const [inquiries, setInquries] = useState<Array<IInquiry>>([]);
  useEffect(() => {
    (async () => {
      const fetchedInquiries = await apiManager.fetchData<IInquiry>(
        routes.server.inquiry.index,
      );
      // FIX: inquiry/list로 get 요청 에러 메세지 없음. 500에러
      if (fetchedInquiries) setInquries(fetchedInquiries);
    })();
  }, []);
  return (
    <ListContainer>
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
              onClick={() =>
                navigator(
                  `${routes.client.admin}/${ChosenTabMenuEnum.inquiry}/${inquiry.inquiryId}`,
                )
              }
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
