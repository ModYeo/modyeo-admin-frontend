import React, { useMemo, useRef } from "react";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function ColumnCodeForm() {
  const codeInputRef = useRef<HTMLInputElement>(null);

  const columnCodeNameInputRef = useRef<HTMLInputElement>(null);

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
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
    <Form path={routes.server.column} requiredInputItems={requiredInputItems} />
  );
}

export default ColumnCodeForm;
