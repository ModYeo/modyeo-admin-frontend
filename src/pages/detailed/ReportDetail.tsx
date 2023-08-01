import React from "react";
import DetailedForm from "../../components/organisms/DetailedForm";
import routes from "../../constants/routes";

function ReportDetail() {
  return (
    <DetailedForm path={routes.server.report.index} requiredInputItems={[]} />
  );
}

export default ReportDetail;
