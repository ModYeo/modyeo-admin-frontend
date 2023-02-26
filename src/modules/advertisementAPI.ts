import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { IAdvertisement, IDetailedAdvertisement } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface IAdvertisementAPIManager {
  fetchAllAdvertisement: () => Promise<Array<IAdvertisement> | null>;
  makeNewAdvertisement: (
    advertisementName: string,
    urlLink: string,
  ) => Promise<number | null>;
  checkUrlLinkValidation: (urlLink: string) => boolean;
  deleteAdvertisement: (advertisementId: number) => Promise<boolean>;
  fetchDetailedAdvertisement: (
    advertisementId: number,
  ) => Promise<IDetailedAdvertisement | null>;
  modifyAdvertisement: (
    advertisementName: string,
    urlLink: string,
    advertisementId: number,
  ) => Promise<number | null>;
}

class AdvertisementAPIManager implements IAdvertisementAPIManager {
  private advertisementAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private advertisementType = "ARTICLE";

  private urlLinkRegex =
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

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
      // TODO: show error toast.
      return null;
    }
  }

  checkUrlLinkValidation = (urlLink: string) => {
    return this.urlLinkRegex.test(urlLink);
  };

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
      // TODO: show error toast.
      return null;
    }
  }

  async deleteAdvertisement(advertisementId: number) {
    try {
      const { status } = await this.advertisementAxios.delete(
        `${routes.server.advertisement}/${advertisementId}`,
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.advertisement.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }

  async fetchDetailedAdvertisement(advertisementId: number) {
    try {
      const {
        data: { data: detailedAdvertisementInfo },
      } = await this.advertisementAxios.get<{
        data: IDetailedAdvertisement;
      }>(`${routes.server.advertisement}/${advertisementId}`);
      return detailedAdvertisementInfo;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async modifyAdvertisement(
    advertisementName: string,
    urlLink: string,
    advertisementId: number,
  ) {
    try {
      const {
        data: { data: modifiedAdvertisementId },
      } = await this.advertisementAxios.patch<{ data: number }>(
        routes.server.advertisement,
        {
          id: advertisementId,
          advertisementName,
          advertisementType: this.advertisementType,
          imagePath: "",
          urlLink,
        },
      );
      return modifiedAdvertisementId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }
}

const advertisementAPIManager = new AdvertisementAPIManager(authCookieManager);

export default advertisementAPIManager;
