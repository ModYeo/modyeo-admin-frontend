import React from "react";
import useDetail from "../../hooks/common/useDetail";
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
  const { detailedData } = useDetail<IDetailedCategory>(routes.server.category);
  console.log(detailedData);
  return <>{JSON.stringify(detailedData)}</>;
}

export default CategoryDetail;
