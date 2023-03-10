import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { toastSentences } from "../constants/toastSentences";
import { IAuth } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

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

  private invalidTokenServerStatus = 401;

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.apiAxios = axios.create();
    this.apiAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
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
        console.log(error);
        const errorStatus = error.response?.status;
        if (errorStatus === this.invalidTokenServerStatus) {
          const isTokenReissueSuccessful = await this.reissueAccessToken();
          if (isTokenReissueSuccessful) {
            // TODO: resend previous request.
            /*
            const requestData = error.config
              ? (JSON.parse(error.config.data as string) as object)
              : null;
            const method = error.config?.method;
            const url = error.config?.url;
            if (method && url) {
              const requestedData = (await this.callPreviousRequest(
                method,
                url,
                requestData,
              )) as unknown;
              return Promise.resolve(requestedData);
            }
            */
          }
          // TODO: throw a error.
          this.authCookieManager.deleteAccessAndRefreshToken();
        } else {
          const errorMessage =
            error.response?.data.error.message ||
            toastSentences.noErrorMessageServerErorr;
          toast.error(errorMessage);
        }
        return Promise.reject(error);
      },
    );
    this.authCookieManager = authCookieManagerParam;
  }

  /*
  private callPreviousRequest = async (
    method: string,
    url: string,
    requestData: object | null,
  ) => {
    try {
      if (method === "get") {
        
      }
    } catch (e) {}
  };
  */

  private async reissueAccessToken() {
    const [expiredAccessToken, refreshToken] =
      this.authCookieManager.getAccessAndRefreshTokenFromCookie();
    try {
      const {
        data: {
          data: { accessToken, accessTokenExpiresIn },
        },
      } = await axios.post<{ data: IAuth }>(routes.server.reissueAccessToken, {
        accessToken: expiredAccessToken,
        refreshToken,
      });
      this.authCookieManager.saveAccessAndRefreshTokenAsCookie(
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
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
      if ("content" in fetchedData) return fetchedData.content.reverse();
      return fetchedData.reverse();
    } catch (e) {
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
}

const apiManager = new APIManager(authCookieManager);

export default apiManager;
