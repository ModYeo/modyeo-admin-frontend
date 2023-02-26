import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import { IAdvertisement } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface IAdvertisementAPIManager {
  fetchAllAdvertisement: () => Promise<Array<IAdvertisement> | null>;
  makeNewAdvertisement: (
    advertisementName: string,
    urlLink: string,
  ) => Promise<number | null>;
}

class AdvertisementAPIManager implements IAdvertisementAPIManager {
  private advertisementAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private advertisementType = "ARTICLE";

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
      const {
        data: { data: fetchedAdvertisements },
      } = await this.advertisementAxios.get<{
        data: Array<IAdvertisement>;
      }>(routes.server.advertisement);
      return fetchedAdvertisements;
    } catch (e) {
      return null;
    }
  }

  async makeNewAdvertisement(advertisementName: string, urlLink: string) {
    try {
      const {
        data: { data: advertisementId },
      } = await this.advertisementAxios.post<{ data: number }>(
        routes.server.advertisement,
        {
          advertisementName,
          advertisementType: this.advertisementType,
          imagePath: "",
          urlLink,
        },
      );
      return advertisementId;
    } catch (e) {
      return null;
    }
  }
}

const advertisementAPIManager = new AdvertisementAPIManager(authCookieManager);

export default advertisementAPIManager;
