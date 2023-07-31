import React, { useMemo, useRef } from "react";
import { RequiredInputItem } from "../../components/atoms/Input";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

function CollectionForm() {
  const collectionInfoIdInputRef = useRef<HTMLTextAreaElement>(null);

  const collectionInfoNameInputRef = useRef<HTMLTextAreaElement>(null);

  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "collection info id",
        name: "collectionInfoId",
        refObject: collectionInfoIdInputRef,
        elementType: "input",
        defaultValue: "0",
        disabled: true,
      },
      {
        itemName: "collection info name",
        name: "collectionInfoName",
        refObject: collectionInfoNameInputRef,
        elementType: "textarea",
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
    <Form
      path={routes.server.collection}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default CollectionForm;
