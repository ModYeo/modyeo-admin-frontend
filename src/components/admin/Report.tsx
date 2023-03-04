import React from "react";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import { ListContainer } from "../../styles/styles";

function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}

const reportType = [
  "ART",
  "MEMBER",
  "REP",
  "TEAM",
  "TEAM_ART",
  "TEAM_REP",
] as const;

function Report() {
  const handleReportTypeSelectOnChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedType = e.currentTarget.value;
    if (contains(reportType, selectedType)) {
      const fetchedReport = await apiManager.fetchData(
        routes.server.report,
        selectedType,
      );
      console.log(fetchedReport);
    }
  };
  return (
    <ListContainer>
      <h5>report type select</h5>
      <select defaultValue="-" onChange={handleReportTypeSelectOnChange}>
        <option>-</option>
        {reportType.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
    </ListContainer>
  );
}

export default Report;
