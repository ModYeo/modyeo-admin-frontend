import React from "react";
import useReport, {
  ReportStatusEnum,
  reportTypesList,
} from "../../hooks/components/useReport";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import { ObjectType } from "../atoms/Card";
import ModalContent from "../molcules/ModalContent";
import ListElement from "../molcules/ListElement";

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
      <h5>report type select</h5>
      <br />
      <select value={selectedReportType} onChange={onChangeReportType}>
        <option disabled>-</option>
        {reportTypesList.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      {reports.map((report, index) => (
        <List key={report.id}>
          <>
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
          </>
          {detailedReport && (
            <ModalBackground onClick={hideDetailedReportModal}>
              <Modal width={300} height={450}>
                <ModalContent
                  detailedElement={detailedReport as unknown as ObjectType}
                />
              </Modal>
            </ModalBackground>
          )}
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
