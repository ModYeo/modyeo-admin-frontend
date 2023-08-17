import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

import DetailedForm from "../../components/organisms/DetailedForm";

import useReport from "../../hooks/components/useReport";

import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function ReportDetail() {
  const { pathname } = useLocation();

  const reportId = useMemo(() => Number(pathname.split("/").pop()), [pathname]);

  const reportStatusSelectRef = useRef<HTMLSelectElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "report status",
        name: "reportStatus",
        refObject: reportStatusSelectRef,
        elementType: "select",
        defaultValue: "",
        options: ["CFRM", "CPNN", "RCPT"],
      },
    ];
  }, []);

  const { onSubmitReportType } = useReport({
    id: reportId,
    reportStatusSelectRef,
  });

  return (
    <DetailedForm
      path={routes.server.report.index}
      requiredInputItems={requiredInputItems}
      onSubmit={onSubmitReportType}
    />
  );
}

export default ReportDetail;
