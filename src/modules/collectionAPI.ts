import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { ICollection } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface ICollectionAPIManager {
  fetchCollections: () => Promise<Array<ICollection> | null>;
  makeNewCollection: (
    collectionInfoName: string,
    description: string,
  ) => Promise<number | null>;
  deleteCollection: (collectionInfoId: number) => Promise<boolean>;
  modifyCollection: (
    collectionInfoId: number,
    collectionInfoName: string,
    description: string,
  ) => Promise<number | null>;
}

class CollectionAPIManager implements ICollectionAPIManager {
  private collectionAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private useYn = "Y";

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.collectionAxios = axios.create();
    this.collectionAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchCollections() {
    try {
      const {
        data: { data: fetchedCollections },
      } = await this.collectionAxios.get<{ data: Array<ICollection> }>(
        routes.server.collection,
      );
      return fetchedCollections.reverse();
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async makeNewCollection(collectionInfoName: string, description: string) {
    try {
      const {
        data: { data: newCollectionId },
      } = await this.collectionAxios.post<{ data: number }>(
        routes.server.collection,
        {
          collectionInfoId: 0,
          collectionInfoName,
          description,
          useYn: this.useYn,
        },
      );
      return newCollectionId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteCollection(collectionInfoId: number) {
    try {
      const { status } = await this.collectionAxios.delete(
        `${routes.server.collection}/${collectionInfoId}`,
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.collection.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }

  async modifyCollection(
    collectionInfoId: number,
    collectionInfoName: string,
    description: string,
  ) {
    try {
      const {
        data: { data: modifiedCollectionId },
      } = await this.collectionAxios.patch<{ data: number }>(
        routes.server.collection,
        {
          collectionInfoId,
          collectionInfoName,
          description,
          useYn: this.useYn,
        },
      );
      return modifiedCollectionId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }
}

const collectionAPIManager = new CollectionAPIManager(authCookieManager);

export default collectionAPIManager;
