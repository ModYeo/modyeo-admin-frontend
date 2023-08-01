import React from "react";
import ListTable from "../../components/organisms/ListTable";
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

function Report() {
  return (
    <ListTable
      requestUrl={routes.server.report.type}
      elementKey="id"
      elementTitleKey="title"
    />
  );
}

export default Report;
