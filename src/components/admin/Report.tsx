import React from "react";
import reportAPIManager from "../../modules/reportAPI";
import { ListContainer } from "../../styles/styles";

function Report() {
  const handleReportTypeSelectOnChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedType = e.currentTarget.value;
    const fetchedReport = await reportAPIManager.fetchReportsByType(
      selectedType,
    );
    console.log(fetchedReport);
  };
  return (
    <ListContainer>
      <h5>report type select</h5>
      <select defaultValue="-" onChange={handleReportTypeSelectOnChange}>
        <option>-</option>
        {reportAPIManager.reportType.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
    </ListContainer>
  );
}

export default Report;
