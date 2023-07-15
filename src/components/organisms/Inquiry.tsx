import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Inquiry() {
  return (
    <ListTable
      requestUrl={routes.server.inquiry.index}
      elementKey="inquiryId"
      elementTitleKey="title"
    />
  );
}

export default Inquiry;
