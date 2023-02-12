import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { IAuth } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface ISignAPIManager {
  handleSignIn: (id: string, password: string) => Promise<boolean | null>;
  handleSignOut: () => Promise<boolean>;
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
        const encodedAuth = `Basic ${btoa(`${id}:${password}`)}`;
        const {
          data: {
            data: { accessToken, refreshToken },
          },
        } = await this.signInAxios.post<{ data: IAuth }>(
          routes.server.signin,
          {},
          {
            headers: {
              Authorization: encodedAuth,
            },
          },
        );
        this.authCookieManager.saveAccessTokenAsCookie(
          accessToken,
          refreshToken,
        );
        return true;
      } catch (e) {
        // TODO: show error toast.
      }
    }
    return false;
  }

  async handleSignOut() {
    if (this.signInAxios) {
      try {
        const [accessToken, refreshToken] =
          this.authCookieManager.getTokensFromCookie();
        const { status } = await this.signInAxios.post(routes.server.signout, {
          accessToken,
          refreshToken,
        });
        if (status === serverStatus.OK) {
          this.authCookieManager.deleteAccessToken();
          return true;
        }
        throw new Error();
      } catch (e) {
        // TODO: show error toast.
      }
    }
    return false;
  }
}

const signAPIManager = new SignAPIManager(authCookieManager);

export default signAPIManager;
