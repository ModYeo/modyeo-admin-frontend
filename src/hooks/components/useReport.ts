import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import toastSentences from "../../constants/toastSentences";

import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";

export const reportTypesList = [
  "ART",
  "MEMBER",
  "REP",
  "TEAM",
  "TEAM_ART",
  "TEAM_REP",
];

enum ReportStatusEnum {
  CFRM = "CFRM",
  CPNN = "CPNN",
  RCPT = "RCPT",
}

type ReportTypeType = (typeof reportTypesList)[number];

interface IReport {
  contents: string;
  id: number;
  reportReason: "SPAM" | string;
  reportStatus: ReportStatusEnum;
  reportType: ReportTypeType;
  targetId: number;
  title: string;
}

function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}

const useReport = (target?: {
  id: number;
  reportStatusSelectRef: React.RefObject<HTMLSelectElement>;
}) => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const [reports, setReports] = useState<Array<IReport>>([]);

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

  const onSubmitReportType = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (target) {
        const {
          id,
          reportStatusSelectRef: { current },
        } = target;
        if (current) {
          const { value: selectedStatus } = current;

          const modifiedReportId = await apiManager.patchData(
            `${routes.server.report.index}/${id}/${selectedStatus}`,
          );

          if (typeof modifiedReportId === "number")
            toast.info(toastSentences.MODIFICATION_SUCCESS);
        }
      }
    },
    [target],
  );

  return {
    selectedReportType,
    onChangeReportType,
    onSubmitReportType,
  };
};

export default useReport;
export { ReportStatusEnum };
