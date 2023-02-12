import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { IAuth } from "../type/types";

interface ISignAPIManager {
  handleSignIn: (id: string, password: string) => Promise<boolean | null>;
  handleSignOut: () => Promise<void>;
}

class SignAPIManager implements ISignAPIManager {
  private signInAxios: AxiosInstance | null = null;

  constructor() {
    this.signInAxios = axios.create();
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
        this.saveAccessTokenAsCookie(accessToken, refreshToken);
        return true;
      } catch (e) {
        // TODO: show error toast.
        return false;
      }
    }
    return false;
  }

  private saveAccessTokenAsCookie(accessToken: string, refreshToken: string) {
    // TODO: save token in cookie storage.
    console.log(`${accessToken} ${refreshToken}`);
  }

  async handleSignOut() {
    if (this.signInAxios) {
      try {
        const { status } = await this.signInAxios.post(routes.server.signout);
        if (status === serverStatus.OK) this.deleteAccessToken();
        else throw new Error();
      } catch (e) {
        // TODO: show error toast.
      }
    }
  }

  private deleteAccessToken() {
    // TODO: delete access token in cookie storage.
  }
}

const signAPIManager = new SignAPIManager();

export default signAPIManager;
