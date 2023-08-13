import React, { useMemo, useRef } from "react";

import DetailedForm from "../../components/organisms/DetailedForm";

import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function InquiryDetail() {
  const inquiryIdInputRef = useRef<HTMLTextAreaElement>(null);

  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "id",
        name: "inquiryId",
        refObject: inquiryIdInputRef,
        elementType: "input",
        defaultValue: "",
        disabled: true,
        isPrimary: true,
      },
      {
        itemName: "answer",
        name: "content",
        refObject: contentInputRef,
        elementType: "textarea",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <DetailedForm
      path={routes.server.inquiry.index}
      subPath={routes.server.answer}
      requiredInputItems={requiredInputItems}
      method="post"
    />
  );
}

export default InquiryDetail;
