import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import { toastSentences } from "../../constants/toastSentences";

export const reportType = [
  "ART",
  "MEMBER",
  "REP",
  "TEAM",
  "TEAM_ART",
  "TEAM_REP",
] as const;

enum ReportStatusEnum {
  CFRM = "CFRM",
  CPNN = "CPNN",
  RCPT = "RCPT",
}

type ReportTypeType = (typeof reportType)[number];

interface IReport {
  contents: string;
  id: number;
  reportReason: "SPAM" | string;
  reportStatus: ReportStatusEnum;
  reportType: ReportTypeType;
  targetId: number;
  title: string;
}

interface IDetailedReport extends IReport {
  createdBy: number;
  createdTime: Array<number>;
  reportType: ReportTypeType;
  updatedBy: number;
  updatedTime: Array<number>;
}

function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}

interface UseReport {
  reports: Array<IReport>;
  detailedReport: IDetailedReport | null;
  onChangeReportType: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => Promise<void>;
  onChangeTargetReportStatus: (
    changedReportStatus: ReportStatusEnum,
    reportId: number,
  ) => Promise<void>;
  initializeDetailedReport: (reportId: number) => Promise<void>;
  hideDetailedReportModal: () => void;
}

const useReport = (): UseReport => {
  // TODO: navigator로 report type 바꾸면 useEffect로 알맞은 type의 report들 가져오기. url을 통한 방문에 대응할 수 있도록 url과 report type 일치시키기.
  const [reports, setReports] = useState<Array<IReport>>([]);

  const [detailedReport, setDetailedReport] = useState<IDetailedReport | null>(
    null,
  );

  const fetchReports = useCallback(
    (changedReportStatusType: ReportTypeType) => {
      return apiManager.fetchData<IReport>(
        routes.server.report.type,
        changedReportStatusType,
      );
    },
    [],
  );

  const onChangeReportType = useCallback(
    async ({
      currentTarget: { value: changedReportType },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      if (contains(reportType, changedReportType)) {
        const fetchedReport = await fetchReports(changedReportType);
        if (fetchedReport) setReports(fetchedReport.reverse());
      }
    },
    [fetchReports],
  );

  const sendPatchReportRequest = useCallback(
    (changedReportStatus: ReportStatusEnum, reportId: number) => {
      return apiManager.modifyData(
        `${routes.server.report.index}/${reportId}/${changedReportStatus}`,
      );
    },
    [],
  );

  const onChangeTargetReportStatus = useCallback(
    async (changedReportStatus: ReportStatusEnum, reportId: number) => {
      // TODO: 위 onChangeReportType 함수와 같이 올바르지 못한 report status 입력하지 못하도록 js로 방어하기.
      const modifiedReportId = await sendPatchReportRequest(
        changedReportStatus,
        reportId,
      );
      if (modifiedReportId) toast.info(toastSentences.report.modified);
    },
    [sendPatchReportRequest],
  );

  const fetchDetailedReport = useCallback((reportId: number) => {
    return apiManager.fetchDetailedData<IDetailedReport>(
      `${routes.server.report.index}/${reportId}`,
    );
  }, []);

  const initializeDetailedReport = useCallback(
    async (reportId: number) => {
      const fetchedDetailedReport = await fetchDetailedReport(reportId);
      if (fetchedDetailedReport) setDetailedReport(fetchedDetailedReport);
    },
    [fetchDetailedReport],
  );

  const hideDetailedReportModal = useCallback(() => {
    setDetailedReport(null);
  }, []);

  return {
    reports,
    detailedReport,
    onChangeReportType,
    onChangeTargetReportStatus,
    initializeDetailedReport,
    hideDetailedReportModal,
  };
};

export default useReport;
export { ReportStatusEnum };
