import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import apiManager from "../../modules/apiManager";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";
import { ObjectType } from "../../components/atoms/Card";

import toastSentences from "../../constants/toastSentences";
import routes from "../../constants/routes";

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

interface UseReport {
  selectedReportType: string;
  onChangeReportType: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const useReport = (): UseReport => {
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

  return {
    selectedReportType,
    onChangeReportType,
  };
};

export default useReport;
export { ReportStatusEnum };
