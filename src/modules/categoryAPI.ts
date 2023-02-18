import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { ICategory } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./StatusCode";

interface ICategoryAPIManager {
  fetchAllCategories: () => Promise<Array<ICategory> | null>;
  makeNewCategory: (newCategoryName: string) => Promise<boolean>;
  fetchDetailedCategoryInfo: (categoryId: number) => Promise<ICategory | null>;
  deleteCategory: (categoryId: number) => Promise<boolean>;
}

class CategoryAPIManager implements ICategoryAPIManager {
  private categoryAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private useYn: "Y" | "N" = "N";

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.categoryAxios = axios.create();
    this.categoryAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchAllCategories() {
    try {
      const {
        data: { data: fetchedCategories },
      } = await this.categoryAxios.get<{
        data: Array<ICategory>;
      }>(routes.server.category);
      return fetchedCategories;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async makeNewCategory(newCategoryName: string) {
    try {
      const { status } = await this.categoryAxios.post(routes.server.category, {
        imagePath: "",
        name: newCategoryName,
        useYn: this.useYn,
      });
      // FIX: now this request gets 400 Bad request response.
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) return true;
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }

  async fetchDetailedCategoryInfo(categoryId: number) {
    try {
      const {
        data: { data: fetchedCategory },
      } = await this.categoryAxios.get<{
        data: ICategory;
      }>(`${routes.server.category}/${categoryId}`);
      return fetchedCategory;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      const { status } = await this.categoryAxios.delete(
        `${routes.server.category}/${categoryId}`,
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.categoryDeleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }
}

const categoryAPIManager = new CategoryAPIManager(authCookieManager);

export default categoryAPIManager;
