import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";

interface ISignAPIManager {
  handleSignIn: (id: string, password: string) => Promise<boolean | null>;
  handleSignOut: () => Promise<void>;
}

class SignAPIManager implements ISignAPIManager {
  private signInAxios: AxiosInstance | null = null;

  constructor() {
    this.signInAxios = axios.create();
    this.signInAxios.defaults.baseURL = "/";
  }

  async handleSignIn(id: string, password: string) {
    if (this.signInAxios) {
      try {
        const {
          data: { token },
        }: { data: { token: string } } = await this.signInAxios.post(
          routes.server.signin,
          {
            id,
            password,
          },
        );
        this.saveAccessTokenAsCookie(token);
        return true;
      } catch (e) {
        // TODO: show error toast.
        return false;
      }
    }
    return false;
  }

  private saveAccessTokenAsCookie(token: string) {
    // TODO: save token in cookie storage.
    console.log(token);
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
