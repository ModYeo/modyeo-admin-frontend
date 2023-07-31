import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

function NoticeForm() {
  const contentInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const titleInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "content",
        name: "content",
        refObject: contentInputRef,
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
      {
        itemName: "title",
        name: "title",
        refObject: titleInputRef,
        elementType: "input",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <Form path={routes.server.notice} requiredInputItems={requiredInputItems} />
  );
}

export default NoticeForm;
