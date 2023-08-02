import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import DetailedForm from "../../components/organisms/DetailedForm";
import routes from "../../constants/routes";

function NoticeDetail() {
  const noticeIdInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const titleInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "id",
        name: "id",
        refObject: noticeIdInputRef,
        elementType: "input",
        defaultValue: "",
        isPrimary: true,
      },
      {
        itemName: "title",
        name: "title",
        refObject: titleInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "content",
        name: "content",
        refObject: contentInputRef,
        elementType: "textarea",
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
    <DetailedForm
      path={routes.server.notice}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default NoticeDetail;
