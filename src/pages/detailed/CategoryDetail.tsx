import React, { useMemo, useRef } from "react";

import { RequiredInputItem } from "../../components/atoms/Input";
import DetailedForm from "../../components/organisms/DetailedForm";

import routes from "../../constants/routes";

interface IDetailedCategory {
  categoryId: number;
  categoryName: string;
  useYn: "Y" | "N";
  createdBy: null;
  createdTime: string;
  updatedBy: null;
  updatedTime: string;
}

function CategoryDetail() {
  const categoryIdInputRef = useRef<HTMLInputElement>(null);

  const categoryNameInputRef = useRef<HTMLInputElement>(null);

  const imagePathInputRef = useRef<{ file: File | null }>({ file: null });

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "category id",
        name: "categoryId",
        refObject: categoryIdInputRef,
        elementType: "input",
        defaultValue: "",
        isPrimary: true,
      },
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
    <DetailedForm<IDetailedCategory>
      path={routes.server.category}
      requiredInputItems={requiredInputItems}
    />
  );
}

export default CategoryDetail;
