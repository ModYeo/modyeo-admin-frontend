import React from "react";
import styled from "styled-components";
import useReport, {
  ReportStatusEnum,
  reportTypesList,
} from "../../hooks/components/useReport";

import { ObjectType } from "../atoms/Card";
import ListElement from "../molcules/ListElement";

import { List, ListContainer, Title } from "../../styles/styles";

const ReportWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

function Report() {
  const {
    reports,
    selectedReportType,
    onChangeReportType,
    onChangeTargetReportStatus,
    initializeDetailedReport,
  } = useReport();

  return (
    <ListContainer>
      <Title>Report Types</Title>
      <select value={selectedReportType} onChange={onChangeReportType}>
        <option disabled>-</option>
        {reportTypesList.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      {reports.map((report, index) => (
        <List key={report.id}>
          <ReportWrapper>
            <ListElement
              listElement={report as unknown as ObjectType}
              elementId={report.id}
              elementIndex={index}
              initializeDetailedElement={initializeDetailedReport}
            />
            <div>
              처리 상태 -
              <select
                defaultValue={report.reportStatus}
                onChange={({
                  currentTarget: { value: changedReportStatus },
                }: React.ChangeEvent<HTMLSelectElement>) =>
                  onChangeTargetReportStatus(
                    changedReportStatus as ReportStatusEnum,
                    report.id,
                  )
                }
              >
                {Object.values(ReportStatusEnum).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </ReportWrapper>
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
