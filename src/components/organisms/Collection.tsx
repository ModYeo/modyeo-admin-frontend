import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Collection() {
  return (
    <ListTable
      requestUrl={routes.server.collection}
      elementKey="collectionInfoId"
      elementTitleKey="collectionInfoName"
    />
  );
}

export default Collection;
