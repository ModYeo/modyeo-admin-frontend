import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";
import DetailedForm from "../../components/organisms/DeatiledForm";

function ColumnCodeDetail() {
  const codeIdInputRef = useRef<HTMLInputElement>(null);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const columnCodeNameInputRef = useRef<HTMLInputElement>(null);

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "column code id",
        name: "columnCodeId",
        refObject: codeIdInputRef,
        elementType: "input",
        defaultValue: "",
        isPrimary: true,
      },
      {
        itemName: "code",
        name: "code",
        refObject: codeInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "column code name",
        name: "columnCodeName",
        refObject: columnCodeNameInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "description",
        name: "description",
        refObject: descriptionInputRef,
        elementType: "textarea",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <DetailedForm
      path={routes.server.column}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default ColumnCodeDetail;
