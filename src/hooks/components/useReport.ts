import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import toastSentences from "../../constants/toastSentences";

export const reportTypesList = [
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

type ReportTypeType = (typeof reportTypesList)[number];

const REPORT_STATUS_LIST = Object.values(ReportStatusEnum);

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
  selectedReportType: string;
  detailedReport: IDetailedReport | null;
  onChangeReportType: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeTargetReportStatus: (
    changedReportStatus: ReportStatusEnum,
    reportId: number,
  ) => Promise<void>;
  initializeDetailedReport: (reportId: number) => Promise<void>;
  hideDetailedReportModal: () => void;
}

const useReport = (): UseReport => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const [reports, setReports] = useState<Array<IReport>>([]);

  const [detailedReport, setDetailedReport] = useState<IDetailedReport | null>(
    null,
  );

  const reportTypePathParam = useMemo(() => {
    const pathElements = pathname.split("/");
    return pathElements[pathElements.length - 1];
  }, [pathname]);

  const isValidReportType = useMemo(
    () => contains(reportTypesList, reportTypePathParam),
    [reportTypePathParam],
  );

  const selectedReportType = useMemo(() => {
    return isValidReportType ? reportTypePathParam : "-";
  }, [isValidReportType, reportTypePathParam]);

  const fetchReports = useCallback(() => {
    return apiManager.fetchData<IReport>(
      routes.server.report.type,
      reportTypePathParam,
    );
  }, [reportTypePathParam]);

  const initializaReportsList = useCallback(async () => {
    const fetchedReport = await fetchReports();
    if (fetchedReport) setReports(fetchedReport.reverse());
  }, [fetchReports]);

  const setReportsListAsDefault = useCallback(() => {
    setReports((reportsList) => {
      if (reportsList.length !== 0) return [];
      return reportsList;
    });
    if (pathname !== routes.client.report) {
      toast.error(toastSentences.invalidRequest);
      navigator(routes.client.report);
    }
  }, [pathname, setReports, navigator]);

  const onChangeReportType = useCallback(
    ({
      currentTarget: { value: changedReportType },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      if (contains(reportTypesList, changedReportType)) {
        navigator(`${routes.client.report}/${changedReportType}`);
      } else setReportsListAsDefault();
    },
    [navigator, setReportsListAsDefault],
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
      if (REPORT_STATUS_LIST.includes(changedReportStatus)) {
        const modifiedReportId = await sendPatchReportRequest(
          changedReportStatus,
          reportId,
        );
        if (modifiedReportId) toast.info(toastSentences.report.modified);
      } else toast.error(toastSentences.invalidRequest);
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

  useEffect(() => {
    if (isValidReportType) initializaReportsList();
    else setReportsListAsDefault();
  }, [
    reportTypePathParam,
    isValidReportType,
    initializaReportsList,
    setReportsListAsDefault,
  ]);

  return {
    reports,
    selectedReportType,
    detailedReport,
    onChangeReportType,
    onChangeTargetReportStatus,
    initializeDetailedReport,
    hideDetailedReportModal,
  };
};

export default useReport;
export { ReportStatusEnum };
