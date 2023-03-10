import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { toastSentences } from "../constants/toastSentences";
import { IAuth } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface ISignAPIManager {
  handleSignIn: (id: string, password: string) => Promise<boolean | null>;
  handleSignOut: () => Promise<boolean>;
  checkTokensValidation: () => Promise<boolean>;
}

class SignAPIManager implements ISignAPIManager {
  private signInAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.signInAxios = axios.create();
    this.authCookieManager = authCookieManagerParam;
  }

  async handleSignIn(id: string, password: string) {
    if (this.signInAxios) {
      try {
        const encodedAuth = this.encodeIdAndPassword(id, password);
        const {
          data: {
            data: { accessToken, refreshToken },
            // data: { accessToken, refreshToken, accessTokenExpiresIn },
          },
        } = await this.signInAxios.post<{ data: IAuth }>(
          routes.server.signin,
          {},
          {
            headers: {
              isAdmin: true,
              Authorization: encodedAuth,
            },
          },
        );
        this.authCookieManager.saveAccessAndRefreshTokenAsCookie(
          accessToken,
          refreshToken,
          // accessTokenExpiresIn,
        );
        return true;
      } catch (e) {
        const { response } = e as AxiosError<{ error: { message: string } }>;
        toast.error(
          response?.data.error.message || toastSentences.signInFailed,
        );
      }
    }
    return false;
  }

  async handleSignOut() {
    if (this.signInAxios) {
      try {
        const [accessToken, refreshToken] =
          this.authCookieManager.getAccessAndRefreshTokenFromCookie();
        const { status } = await this.signInAxios.post(routes.server.signout, {
          accessToken,
          refreshToken,
        });
        if (status === serverStatus.OK) {
          this.authCookieManager.deleteAccessAndRefreshToken();
          return true;
        }
        throw new Error();
      } catch (e) {
        toast.error(toastSentences.requestResignIn);
      }
    }
    return false;
  }

  async checkTokensValidation() {
    const [accessToken, refreshToken] =
      this.authCookieManager.getAccessAndRefreshTokenFromCookie();
    if (!accessToken || !refreshToken) return false;
    const isTokensValid = await this.callTokensValidationRequest(
      accessToken,
      refreshToken,
    );
    if (isTokensValid) return true;
    return false;
  }

  private callTokensValidationRequest = async (
    accessToken: string,
    refreshToken: string,
  ) => {
    try {
      const { status } = await this.signInAxios.post(
        routes.server.checkTokensValidation,
        {
          accessToken,
          refreshToken,
        },
      );
      if (status === serverStatus.OK) return true;
      throw new Error();
    } catch (e) {
      return false;
    }
  };

  private encodeIdAndPassword(id: string, password: string) {
    return `Basic ${btoa(`${id}:${password}`)}`;
  }
}

const signAPIManager = new SignAPIManager(authCookieManager);

export default signAPIManager;
