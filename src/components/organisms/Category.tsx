import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

interface CategoryType {
  id: number;
  imagePath: string | null;
  name: string;
}

function Category() {
  return (
    <ListTable requestUrl={routes.server.category} elementTitleKey="name" />
  );
}

export default Category;
