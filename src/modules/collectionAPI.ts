import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { toastSentences } from "../constants/toastSentences";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface ICollectionAPIManager {
  fetchCollections: <T>(path: string) => Promise<Array<T> | null>;
  makeNewCollection: (path: string, obj: Object) => Promise<number | null>;
  deleteCollection: (path: string, objectId: number) => Promise<boolean>;
  modifyCollection: (path: string, obj: Object) => Promise<number | null>;
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

  async fetchCollections<T>(path: string) {
    try {
      const {
        data: { data: fetchedCollections },
      } = await this.collectionAxios.get<{ data: Array<T> }>(path);
      return fetchedCollections.reverse();
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async makeNewCollection(path: string, obj: Object) {
    try {
      const {
        data: { data: newCollectionId },
      } = await this.collectionAxios.post<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return newCollectionId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteCollection(path: string, collectionInfoId: number) {
    try {
      const { status } = await this.collectionAxios.delete(
        `${path}/${collectionInfoId}`,
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

  async modifyCollection(path: string, obj: Object) {
    try {
      const {
        data: { data: modifiedCollectionId },
      } = await this.collectionAxios.patch<{ data: number }>(path, {
        ...obj,
        useYn: this.useYn,
      });
      return modifiedCollectionId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }
}

const collectionAPIManager = new CollectionAPIManager(authCookieManager);

export default collectionAPIManager;
