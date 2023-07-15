import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Category() {
  return (
    <ListTable requestUrl={routes.server.category} elementTitleKey="name" />
  );
}

export default Category;
