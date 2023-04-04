import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { toastSentences } from "../constants/toastSentences";
import { IAuth } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface IAPIManager {
  fetchData: <T>(path: string, typeParam?: string) => Promise<Array<T> | null>;
  postNewDataElem: <T extends object>(
    path: string,
    obj: T,
  ) => Promise<number | null>;
  deleteData: (path: string, objectId: number) => Promise<boolean>;
  modifyData: <T extends object>(
    path: string,
    obj?: T,
  ) => Promise<number | null>;
  fetchDetailedData: <T>(path: string, elemId?: number) => Promise<T | null>;
}

enum HttpMethodEnum {
  get = "get",
  post = "post",
  patch = "patch",
  delete = "delete",
}

type BodyDataType = { [key: string]: unknown };

class APIManager implements IAPIManager {
  public apiAxios: AxiosInstance = axios.create();

  private reRequestAxios: AxiosInstance = axios.create();

  private authCookieManager: AuthCookieManager;

  private useYn = "Y";

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.authCookieManager = authCookieManagerParam;
    this.setupApiAxios();
    this.setupRerequestAxios();
  }

  private includesXSS = (bodyData: BodyDataType): boolean => {
    return Object.keys(bodyData).some((key) => {
      const value = bodyData[key];
      return (
        typeof value === "string" &&
        value.includes("<script>") &&
        value.includes("</script>")
      );
    });
  };

  private setupApiAxios() {
    this.apiAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      const bodyData = config.data as BodyDataType | undefined;
      if (bodyData && this.includesXSS(bodyData))
        throw new AxiosError(toastSentences.includeXSS);
      return configCopied;
    });
    this.apiAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (
        error: AxiosError<{
          error: { message: string };
        }>,
      ) => {
        const errorStatus = error.response?.status;
        if (errorStatus === serverStatus.UNAUTHORIZED) {
          const isTokenReissueSuccessful = await this.reissueAccessToken();
          if (isTokenReissueSuccessful) {
            const requestData = error.config?.data
              ? (JSON.parse(error.config.data as string) as object)
              : undefined;
            const method = error.config?.method as HttpMethodEnum;
            const url = error.config?.url;
            if (method && url) {
              try {
                const reRequestedData = await this.callPreviousAPIRequest(
                  method,
                  url,
                  requestData,
                );
                return reRequestedData;
              } catch (reRequestError) {
                return Promise.reject(reRequestError);
              }
            }
          } else this.authCookieManager.deleteAccessAndRefreshToken();
        } else {
          this.showErrorMessageToast(
            error.message || error.response?.data.error.message,
          );
        }
        return Promise.reject(error);
      },
    );
  }

  private setupRerequestAxios() {
    this.reRequestAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Accept = "application/json, text/plain, */*";
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.reRequestAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (
        error: AxiosError<{
          error: { message: string };
        }>,
      ) => {
        this.showErrorMessageToast(
          error.message || error.response?.data.error.message,
        );
        return Promise.reject(error);
      },
    );
  }

  private callPreviousAPIRequest = async (
    method: HttpMethodEnum,
    url: string,
    reRequestedData?: object | null,
  ) => {
    try {
      if (method === HttpMethodEnum.get) {
        const reRequestFetchedResult = await this.reRequestAxios.get<{
          data: unknown | { content: Array<unknown> };
        }>(url);
        return reRequestFetchedResult;
      }
      if (method === HttpMethodEnum.post) {
        const reRequestedPostResult = await this.reRequestAxios.post<{
          data: number;
        }>(url, reRequestedData);
        return reRequestedPostResult;
      }
      if (method === HttpMethodEnum.patch) {
        const reRquestedPatchResult = await this.reRequestAxios.patch<{
          data: number;
        }>(url, reRequestedData);
        return reRquestedPatchResult;
      }
      if (method === HttpMethodEnum.delete) {
        const reRequestedDeleteResult = await this.reRequestAxios.delete(url);
        return reRequestedDeleteResult;
      }
    } catch (e) {
      throw e as AxiosError;
    }
    throw new AxiosError();
  };

  private async reissueAccessToken() {
    const [expiredAccessToken, refreshToken] =
      this.authCookieManager.getAccessAndRefreshTokenFromCookie();
    try {
      const {
        data: {
          data: { accessToken, refreshToken: reissuedRefreshToken },
          // data: {
          //   accessToken,
          //   accessTokenExpiresIn,
          //   refreshToken: reissuedRefreshToken,
          // },
        },
      } = await axios.post<{ data: IAuth }>(routes.server.reissueAccessToken, {
        accessToken: expiredAccessToken,
        refreshToken,
      });
      this.authCookieManager.saveAccessAndRefreshTokenAsCookie(
        accessToken,
        reissuedRefreshToken,
        // accessTokenExpiresIn,
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async fetchData<T>(path: string, typeParam?: string) {
    try {
      const {
        data: { data: fetchedData },
      } = await this.apiAxios.get<{
        data: Array<T> | { content: Array<T> };
      }>(`${path}/${typeParam || ""}`);
      if ("content" in fetchedData) return fetchedData.content;
      return fetchedData;
    } catch (e) {
      return null;
    }
  }

  async postNewDataElem<T extends object>(path: string, obj: T) {
    try {
      const {
        data: { data: newElemId },
      } = await this.apiAxios.post<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return newElemId;
    } catch (e) {
      return null;
    }
  }

  async deleteData(path: string, targetDataId: number) {
    try {
      const { status } = await this.apiAxios.delete(`${path}/${targetDataId}`);
      if (this.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      return false;
    }
  }

  async modifyData<T extends object>(path: string, obj?: T) {
    try {
      const {
        data: { data: modifieElemId },
      } = await this.apiAxios.patch<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return modifieElemId;
    } catch (e) {
      return null;
    }
  }

  async fetchDetailedData<T>(path: string, elemId?: number) {
    try {
      const {
        data: { data: fetchedDetailedData },
      } = await this.apiAxios.get<{ data: T }>(`${path}/${elemId || ""}`);
      return fetchedDetailedData;
    } catch (e) {
      return null;
    }
  }

  private checkIfIsRequestSucceeded(status: number): boolean {
    if (
      status === serverStatus.OK ||
      status === serverStatus.CREATED ||
      status === serverStatus.NO_CONTENT
    ) {
      return true;
    }
    return false;
  }

  private showErrorMessageToast = (errorMessage?: string) => {
    toast.error(errorMessage || toastSentences.noErrorMessageFromServer);
  };
}

const apiManager = new APIManager(authCookieManager);

export default apiManager;
