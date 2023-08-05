import React, { useMemo, useRef } from "react";
import DetailedForm from "../../components/organisms/DetailedForm";
import routes from "../../constants/routes";
import { RequiredInputItem } from "../../components/atoms/Input";

function ReportDetail() {
  const reportStatusSelectRef = useRef<HTMLSelectElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "report status",
        name: "reportStatus",
        refObject: reportStatusSelectRef,
        elementType: "select",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <DetailedForm
      path={routes.server.report.index}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default ReportDetail;
