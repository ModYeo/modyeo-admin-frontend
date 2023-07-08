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

const ReportTypeSelect = styled.select`
  border-radius: 5px;
  color: #5476d7;
  border: 1px solid #5476d7;
  appearance: none;
`;

const ReportTypeSelectHeader = styled(ReportTypeSelect)`
  padding: 10px 15px;
`;

const ReportTypeSelectElement = styled(ReportTypeSelect)`
  padding: 5px 8px;
`;

const ReportStatusSpan = styled.span`
  color: #b5b5b5;
  font-size: 12px;
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
      <ReportTypeSelectHeader
        value={selectedReportType}
        onChange={onChangeReportType}
      >
        <option disabled>-</option>
        {reportTypesList.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </ReportTypeSelectHeader>
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
              <ReportStatusSpan>처리 상태 - &nbsp;</ReportStatusSpan>
              <ReportTypeSelectElement
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
              </ReportTypeSelectElement>
            </div>
          </ReportWrapper>
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
