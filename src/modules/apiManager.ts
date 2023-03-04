import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { toastSentences } from "../constants/toastSentences";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface IAPIManager {
  fetchData: <T>(path: string, typeParam?: string) => Promise<Array<T> | null>;
  postNewDataElem: (path: string, obj: Object) => Promise<number | null>;
  deleteData: (path: string, objectId: number) => Promise<boolean>;
  modifyData: (path: string, obj: Object) => Promise<number | null>;
  fetchDetailedData: <D>(path: string, elemId: number) => Promise<D | null>;
}

class APIManager implements IAPIManager {
  private apiAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private useYn = "Y";

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.apiAxios = axios.create();
    this.apiAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchData<T>(path: string, typeParam?: string) {
    try {
      const {
        data: { data: fetchedData },
      } = await this.apiAxios.get<{
        data: Array<T> | { content: Array<T> };
      }>(`${path}/${typeParam || ""}`);
      if ("content" in fetchedData) return fetchedData.content;
      return fetchedData.reverse();
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async postNewDataElem(path: string, obj: Object) {
    try {
      const {
        data: { data: newElemId },
      } = await this.apiAxios.post<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return newElemId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteData(path: string, targetDataId: number) {
    try {
      const { status } = await this.apiAxios.delete(`${path}/${targetDataId}`);
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }

  async modifyData(path: string, obj: Object) {
    try {
      const {
        data: { data: modifieElemId },
      } = await this.apiAxios.patch<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return modifieElemId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async fetchDetailedData<D>(path: string, elemId: number) {
    try {
      const {
        data: { data: fetchedDetailedData },
      } = await this.apiAxios.get<{ data: D }>(`${path}/${elemId}`);
      return fetchedDetailedData;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }
}

const apiManager = new APIManager(authCookieManager);

export default apiManager;
