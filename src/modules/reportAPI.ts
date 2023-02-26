import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import authCookieManager, { AuthCookieManager } from "./authCookie";

function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}

interface IReportAPIManager {
  reportType: ReadonlyArray<string>;
  fetchReportsByType: (selectedType: string) => Promise<unknown | null>;
}

class ReportAPIManager implements IReportAPIManager {
  private reportAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  public reportType = [
    "ART",
    "MEMBER",
    "REP",
    "TEAM",
    "TEAM_ART",
    "TEAM_REP",
  ] as const;

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.reportAxios = axios.create();
    this.reportAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchReportsByType(selectedType: string) {
    try {
      if (contains(this.reportType, selectedType)) {
        const { data } = await this.reportAxios<unknown>(
          `${routes.server.report}/${selectedType}`,
        );
        return data;
        // FIX: this request gets 500 error.
      }
      throw new Error();
    } catch (e) {
      return null;
    }
  }
}

const reportAPIManager = new ReportAPIManager(authCookieManager);

export default reportAPIManager;
