import React from "react";
import styled from "styled-components";
import useReport, {
  ReportStatusEnum,
  reportTypesList,
} from "../../hooks/components/useReport";
import Modal from "../commons/Modal";
import {
  List,
  ListContainer,
  ModalBackground,
  Title,
} from "../../styles/styles";
import { ObjectType } from "../atoms/Card";
import ModalContent from "../molcules/ModalContent";
import ListElement from "../molcules/ListElement";

const ReportWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

function Report() {
  const {
    reports,
    selectedReportType,
    detailedReport,
    onChangeReportType,
    onChangeTargetReportStatus,
    initializeDetailedReport,
    hideDetailedReportModal,
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
          {/* {detailedReport && (
            <ModalBackground onClick={hideDetailedReportModal}>
              <Modal>
                <ModalContent
                  detailedElement={detailedReport as unknown as ObjectType}
                />
              </Modal>
            </ModalBackground>
          )} */}
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
