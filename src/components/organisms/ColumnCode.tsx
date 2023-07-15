import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function ColumnCode() {
  return (
    <ListTable
      requestUrl={routes.server.column}
      elementKey="columnCodeId"
      elementTitleKey="columnCodeName"
    />
  );
}

export default ColumnCode;
