import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { IColumCode, IDetailedColumnCode } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface IColumnAPIManager {
  fetchAllColumnCode: () => Promise<unknown>;
  deleteColumnCode: (columnCodeId: number) => Promise<boolean>;
  fetchDetailedColumnCodeInfo: (
    columnCodeId: number,
  ) => Promise<unknown | null>;
  createNewColumnCode: (
    code: string,
    columnCodeName: string,
    description: string,
  ) => Promise<number | null>;
  modifyColumnCode: (
    columnCodeId: number,
    code: string,
    columnCodeName: string,
    description: string,
  ) => Promise<unknown>;
}

class ColumnAPIManager implements IColumnAPIManager {
  private columnAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.columnAxios = axios.create();
    this.columnAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async createNewColumnCode(
    code: string,
    columnCodeName: string,
    description: string,
  ) {
    try {
      const {
        data: { data: newColumnCodeId },
      } = await this.columnAxios.post<{ data: number }>(routes.server.column, {
        code,
        columnCodeName,
        description,
      });
      return newColumnCodeId;
    } catch (e) {
      return null;
    }
  }

  async fetchAllColumnCode() {
    try {
      const {
        data: {
          data: { content: fetchedColumnCodes },
        },
      } = await this.columnAxios.get<{
        data: { content: Array<IColumCode> };
      }>(routes.server.column);
      return fetchedColumnCodes;
    } catch (e) {
      return null;
    }
  }

  async fetchDetailedColumnCodeInfo(columnCodeId: number) {
    try {
      const {
        data: { data: fetchedDetailedColumnCode },
      } = await this.columnAxios.get<{
        data: IDetailedColumnCode;
      }>(`${routes.server.column}/${columnCodeId}`);
      return fetchedDetailedColumnCode;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteColumnCode(columnCodeId: number) {
    try {
      const { status } = await this.columnAxios.delete(
        `${routes.server.column}/${columnCodeId}`,
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.columnCode.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }

  async modifyColumnCode(
    columnCodeId: number,
    code: string,
    columnCodeName: string,
    description: string,
  ) {
    try {
      const {
        data: { data: modifiedColumnCodeId },
      } = await this.columnAxios.patch<{ data: number }>(routes.server.column, {
        columnCodeId,
        code,
        columnCodeName,
        description,
      });
      return modifiedColumnCodeId;
    } catch (e) {
      return null;
    }
  }
}

const columnAPIManager = new ColumnAPIManager(authCookieManager);

export default columnAPIManager;
