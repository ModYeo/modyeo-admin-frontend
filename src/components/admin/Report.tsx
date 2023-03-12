import React, { useState } from "react";
import { toast } from "react-toastify";
import { reportType } from "../../constants/reportTypes";
import routes from "../../constants/routes";
import { toastSentences } from "../../constants/toastSentences";
import apiManager from "../../modules/apiManager";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import { ReportStatusEnum } from "../../type/enums";
import { IDetailedReport, IReport } from "../../type/types";
import Modal from "../commons/Modal";

function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}

function Report() {
  const [reports, setReports] = useState<Array<IReport>>([]);
  const [clickedReport, setClickedReport] = useState<IDetailedReport | null>(
    null,
  );
  const handleReportTypeSelectOnChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedType = e.currentTarget.value;
    if (contains(reportType, selectedType)) {
      const fetchedReport = await apiManager.fetchData<IReport>(
        routes.server.report.type,
        selectedType,
      );
      if (fetchedReport) setReports(fetchedReport.reverse());
    }
  };
  const handleOnReportStatusChange = async (
    newStatus: ReportStatusEnum,
    reportId: number,
  ) => {
    const {
      data: { data: modifiedReportId },
    } = await apiManager.apiAxios.patch<{ data: { data: number } }>(
      `${routes.server.report.index}/${reportId}/${newStatus}`,
    );
    if (modifiedReportId) toast.info(toastSentences.report.modified);
  };
  const fetchDetailedReport = async (reportId: number) => {
    const {
      data: { data: fetchedDetailedReport },
    } = await apiManager.apiAxios.get<{ data: IDetailedReport }>(
      `${routes.server.report.index}/${reportId}`,
    );
    if (fetchedDetailedReport) setClickedReport(fetchedDetailedReport);
  };
  return (
    <ListContainer>
      <h5>report type select</h5>
      <br />
      <select defaultValue="-" onChange={handleReportTypeSelectOnChange}>
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleOnReportStatusChange(
                    e.currentTarget.value as ReportStatusEnum,
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
                onClick={() => fetchDetailedReport(report.id)}
              >
                about
              </button>
            </div>
          </div>
          {clickedReport && (
            <ModalBackground onClick={() => setClickedReport(null)}>
              <Modal width={300} height={450}>
                <div>{clickedReport.title}</div>
                <div>report type - {clickedReport.reportType}</div>
                <div>created by - {clickedReport.createdBy}</div>
                <div>updated by - {clickedReport.updatedBy}</div>
              </Modal>
            </ModalBackground>
          )}
        </List>
      ))}
    </ListContainer>
  );
}

export default Report;
