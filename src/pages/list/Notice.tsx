import React from "react";
import ListTable from "../../components/organisms/ListTable";
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
