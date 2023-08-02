import React from "react";

import DetailedForm from "../../components/organisms/DetailedForm";

import routes from "../../constants/routes";

function InquiryDetail() {
  return (
    <DetailedForm path={routes.server.inquiry.index} requiredInputItems={[]} />
  );
}

export default InquiryDetail;
