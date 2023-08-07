import React, { useMemo, useRef } from "react";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function CategoryForm() {
  const categoryNameInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "category name",
        name: "name",
        refObject: categoryNameInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "image path",
        name: "imagePath",
        refObject: imagePathInputRef,
        elementType: "image",
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
