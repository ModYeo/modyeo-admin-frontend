import React from "react";

import ListTable from "../../components/organisms/ListTable";
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
