import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

function CategoryForm() {
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "category name",
        name: "name",
        refObject: categoryInputRef,
        elementType: "input",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <Form
      path={routes.server.category}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default CategoryForm;
