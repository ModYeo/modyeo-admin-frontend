import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface IAdvertisementAPIManager {
  fetchAllAdvertisement: () => Promise<unknown>;
}

class AdvertisementAPIManager implements IAdvertisementAPIManager {
  private advertisementAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.advertisementAxios = axios.create();
    this.advertisementAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchAllAdvertisement() {
    try {
      const fetchedAdvertisements = await this.advertisementAxios.get<{
        data: unknown;
      }>(routes.server.advertisement);
      return fetchedAdvertisements;
    } catch (e) {
      return null;
    }
  }
}

const advertisementAPIManager = new AdvertisementAPIManager(authCookieManager);

export default advertisementAPIManager;
