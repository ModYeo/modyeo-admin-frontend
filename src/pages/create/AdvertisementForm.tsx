import React, { useMemo, useRef } from "react";
import Form from "../../components/organisms/Form";
import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function AdvertisementForm() {
  const advertisementNameInputRef = useRef<HTMLInputElement>(null);

  const advertisementTypeInputRef = useRef<HTMLInputElement>(null);

  const urlLinkInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "advertisement name",
        name: "advertisementName",
        refObject: advertisementNameInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "advertisement type",
        name: "advertisementType",
        refObject: advertisementTypeInputRef,
        elementType: "input",
        defaultValue: "ARTICLE",
        disabled: true,
      },
      {
        itemName: "image path",
        name: "imagePath",
        refObject: imagePathInputRef,
        elementType: "image",
        defaultValue: "",
      },
      {
        itemName: "url link",
        name: "urlLink",
        refObject: urlLinkInputRef,
        elementType: "input",
        defaultValue: "",
      },
    ];
  }, []);

  return (
    <Form
      path={routes.server.advertisement}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default AdvertisementForm;
