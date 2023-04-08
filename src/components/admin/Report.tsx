import React from "react";
import useReport, {
  ReportStatusEnum,
  reportType,
} from "../../hooks/components/useReport";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import Modal from "../commons/Modal";

function Report() {
  const {
    reports,
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
      <select defaultValue="-" onChange={onChangeReportType}>
        <option>-</option>
        {reportType.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      {reports.map((report) => (
        <List key={report.id}>
          <div>
            <div>title - {report.title}</div>
            <div>content - {report.contents}</div>
            <div>신고 종류 - {report.reportType}</div>
            <div>신고 사유 - {report.reportReason}</div>
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
            <div>
              <button
                type="button"
                onClick={() => initializeDetailedReport(report.id)}
              >
                about
              </button>
            </div>
          </div>
          {detailedReport && (
            <ModalBackground onClick={hideDetailedReportModal}>
              <Modal width={300} height={450}>
                <div>
                  <div>{detailedReport.title}</div>
                  <div>report type - {detailedReport.reportType}</div>
                  <div>created by - {detailedReport.createdBy}</div>
                  <div>updated by - {detailedReport.updatedBy}</div>
                </div>
              </Modal>
            </ModalBackground>
          )}
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
