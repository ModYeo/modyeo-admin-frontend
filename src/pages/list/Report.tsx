import React from "react";
import styled from "styled-components";
import useReport, { reportTypesList } from "../../hooks/components/useReport";

import ListTable from "../../components/organisms/ListTable";
import routes from "../../constants/routes";

const Select = styled.select`
  padding: 10px 15px;
  border-radius: 5px;
  color: #5476d7;
  border: 1px solid #5476d7;
  appearance: none;
`;

function Report() {
  const { selectedReportType, onChangeReportType } = useReport();

  return (
    <>
      <Select value={selectedReportType} onChange={onChangeReportType}>
        <option disabled>-</option>
        {reportTypesList.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </Select>
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
