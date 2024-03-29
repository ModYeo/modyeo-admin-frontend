import React, { useMemo, useRef } from "react";

import DetailedForm from "../../components/organisms/DetailedForm";

import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

interface IDetailedCategory {
  categoryId: number;
  categoryName: string;
  useYn: "Y" | "N";
  createdBy: null;
  createdTime: string;
  updatedBy: null;
  updatedTime: string;
}

function CollectionDetail() {
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
        defaultValue: "",
        disabled: true,
        isPrimary: true,
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
    <DetailedForm
      path={routes.server.collection}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default CollectionDetail;
