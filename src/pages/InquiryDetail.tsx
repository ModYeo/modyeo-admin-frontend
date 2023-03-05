import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../constants/routes";

function InquiryDetail({ inquiryNo }: { inquiryNo: number }) {
  const navigator = useNavigate();
  useEffect(() => {
    (() => {
      console.log(inquiryNo);
    })();
  }, [inquiryNo]);
  return (
    <div>
      inquiry detail
      <button type="button" onClick={() => navigator(routes.client.inquiry)}>
        back
      </button>
    </div>
  );
}

export default InquiryDetail;
