import React from "react";

import ListTable from "./ListTable";
import routes from "../../constants/routes";

function Advertisement() {
  return (
    <ListTable
      requestUrl={routes.server.advertisement}
      elementKey="advertisementId"
      elementTitleKey="advertisementName"
    />
  );
}

export default Advertisement;
