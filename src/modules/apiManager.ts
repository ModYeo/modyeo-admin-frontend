import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";

import authCookieManager, { AuthCookieManager } from "./authCookie";

import { IAuth } from "./signAPI";

import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import TOAST_SENTENCES from "../constants/toastSentences";

interface IAPIManager {
  fetchData: <T>(path: string, typeParam?: string) => Promise<Array<T> | null>;
  postData(
    path: string,
    obj: object,
    option?: {
      isXapiKeyNeeded: boolean;
    },
  ): Promise<number | null>;
  ELEMENT_DELETEData: (path: string, objectId: number) => Promise<boolean>;
  patchData(
    path: string,
    obj?: object,
    option?: {
      isXapiKeyNeeded: boolean;
    },
  ): Promise<number | null>;
  fetchDetailedData: <T>(path: string, elemId?: number) => Promise<T | null>;
}

enum HttpMethodEnum {
  get = "get",
  post = "post",
  patch = "patch",
  delete = "delete",
}

type BodyDataType = { [key: string]: unknown };

export class APIManager implements IAPIManager {
  public apiAxios: AxiosInstance = axios.create();

  private reRequestAxios: AxiosInstance = axios.create();

  private authCookieManager: AuthCookieManager;

  private xApiKey = "G3VdJJgjE898YCnUWJIhGazm2LSPlNJN3rjNnKs1";

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

      const { headers } = configCopied;

      headers.Authorization = this.authCookieManager.getAccessTokenWithBearer();

      const bodyData = config.data as BodyDataType | undefined;

      if (bodyData && this.includesXSS(bodyData))
        throw new AxiosError(TOAST_SENTENCES.MAY_XSS_BE_INCLUDED);
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
            error.response?.data.error.message || error.message,
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

  async postData(
    path: string,
    obj: object,
    option?: { isXapiKeyNeeded: boolean },
  ) {
    try {
      const {
        data: { data: newElemId },
      } = await this.apiAxios.post<{ data: number }>(
        path,
        {
          ...obj,
          useYn: this.useYn,
        },
        option?.isXapiKeyNeeded
          ? {
              headers: {
                "x-api-key": this.xApiKey,
              },
            }
          : {},
      );
      return newElemId;
    } catch (e) {
      return null;
    }
  }

  async ELEMENT_DELETEData(path: string, targetDataId: number) {
    try {
      const { status } = await this.apiAxios.delete(`${path}/${targetDataId}`);
      if (this.checkIfIsRequestSucceeded(status)) {
        toast.info(TOAST_SENTENCES.ELEMENT_DELETED);
        return true;
      }
      throw new Error();
    } catch (e) {
      return false;
    }
  }

  async patchData(
    path: string,
    obj?: object,
    option?: { isXapiKeyNeeded: boolean },
  ) {
    try {
      const {
        data: { data: modifieElemId },
      } = await this.apiAxios.patch<{ data: number }>(
        path,
        {
          ...obj,
          useYn: this.useYn,
        },
        option?.isXapiKeyNeeded
          ? {
              headers: {
                "x-api-key": this.xApiKey,
              },
            }
          : {},
      );
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
    toast.error(errorMessage || TOAST_SENTENCES.WRONG_IN_SERVER);
  };
}

const apiManager = new APIManager(authCookieManager);

export default apiManager;
