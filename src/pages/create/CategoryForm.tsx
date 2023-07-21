import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import Form from "../../components/molcules/Form";

function CategoryForm() {
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "category name",
        refObject: categoryInputRef,
        elementType: "input",
        defaultValue: "",
      },
    ];
  }, []);

  return <Form requiredInputItems={requiredInputItems} />;
}

export default CategoryForm;
