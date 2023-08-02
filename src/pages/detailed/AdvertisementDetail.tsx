import React, { useMemo, useRef } from "react";

import { RequiredInputItem } from "../../components/atoms/Input";
import DetailedForm from "../../components/organisms/DetailedForm";

import routes from "../../constants/routes";

interface IAdvertisement {
  advertisementId: number;
  advertisementName: string;
  imagePath: string;
  type: string;
  urlLink: string;
  useYn: "Y" | "N";
}

interface IDetailedAdvertisement extends IAdvertisement {
  createdBy: number;
  createdDate: Array<number>;
  lastModifiedDate: Array<number>;
  type: string;
  updatedBy: number;
  useYn: "Y" | "N";
}

function AdvertisementDetail() {
  const advertisementIdInputRef = useRef<HTMLInputElement>(null);

  const advertisementNameInputRef = useRef<HTMLInputElement>(null);

  const advertisementTypeInputRef = useRef<HTMLInputElement>(null);

  const urlLinkInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "advertisement id",
        name: "id",
        refObject: advertisementIdInputRef,
        elementType: "input",
        defaultValue: "",
        isPrimary: true,
      },
      {
        itemName: "advertisement name",
        name: "advertisementName",
        refObject: advertisementNameInputRef,
        elementType: "input",
        defaultValue: "",
      },
      {
        itemName: "type",
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
    <DetailedForm<IDetailedAdvertisement>
      path={routes.server.advertisement}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default AdvertisementDetail;
