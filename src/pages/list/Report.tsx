import React from "react";
import useReport, { reportTypesList } from "../../hooks/components/useReport";

import ListTable from "../../components/organisms/ListTable";
import Select from "../../components/atoms/Select";

import routes from "../../constants/routes";

function Report() {
  const { selectedReportType, onChangeReportType } = useReport();

  return (
    <>
      <Select options={reportTypesList} onChange={onChangeReportType} />
      {selectedReportType && selectedReportType !== "-" && (
        <ListTable
          requestUrl={`${routes.server.report.type}/${selectedReportType}`}
          elementKey="id"
          elementTitleKey="title"
        />
      )}
    </>
  );
}

export default Report;
