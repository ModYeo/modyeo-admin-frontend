import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Category() {
  return (
    <ListTable
      requestUrl={routes.server.category}
      elementKey="id"
      elementTitleKey="name"
    />
  );
}

export default Category;
