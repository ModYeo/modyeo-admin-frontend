import React from "react";
import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Notice() {
  return (
    <ListTable
      requestUrl={routes.server.notice}
      elementKey="id"
      elementTitleKey="title"
    />
  );
}

export default Notice;
