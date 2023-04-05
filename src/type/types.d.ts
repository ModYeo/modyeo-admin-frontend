import { reportType } from "../constants/reportTypes";
import { AuthorityEnum, InquiryStatusEnum, ReportStatusEnum } from "./enums";

export interface IAuth {
  accessToken: string;
  accessTokenExpiresIn: number;
  grantType: string;
  refreshToken: string;
}

export interface INotice {
  content: string;
  id: number;
  imagePath: string;
  title: string;
}

export interface IDetailedNotice extends INotice {
  createdBy: number;
  createdDate: Array<number>;
  updatedBy: number;
  updatedTime: Array<number>;
  useYn: "Y" | "N";
}

export interface ICollection {
  collectionInfoId: number;
  collectionInfoName: string;
  description: string;
  createdBy?: number;
  createdTime?: string;
  updatedBy?: number;
  updatedTime?: string;
}

export interface IInquiry {
  authority: AuthorityEnum.ROLE_USER;
  createdBy: number;
  createdTime: string;
  inquiryId: number;
  status: InquiryStatusEnum;
  title: string;
}

export interface IAnswer {
  answerId: number;
  authority: AuthorityEnum.ROLE_ADMIN;
  content: string;
  createdBy: number;
  createdTime: string;
  inquiryId: number;
}

export interface IDetailedInquiry {
  answerList: Array<IAnswer>;
  content: string;
  createdBy: number;
  createdTime: string;
  id: number;
  title: number;
}

type ReportTypeType = (typeof reportType)[number];

export interface IReport {
  contents: string;
  id: number;
  reportReason: "SPAM" | string;
  reportStatus: ReportStatusEnum;
  reportType: ReportTypeType;
  targetId: number;
  title: string;
}

export interface IDetailedReport extends IReport {
  createdBy: number;
  createdTime: Array<number>;
  reportType: ReportTypeType;
  updatedBy: number;
  updatedTime: Array<number>;
}
