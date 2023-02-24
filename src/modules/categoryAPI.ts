import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { ICategory, IDetailedCategory } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface ICategoryAPIManager {
  fetchAllCategories: () => Promise<Array<ICategory> | null>;
  makeNewCategory: (newCategoryName: string) => Promise<number | null>;
  fetchDetailedCategoryInfo: (
    categoryId: number,
  ) => Promise<IDetailedCategory | null>;
  deleteCategory: (categoryId: number) => Promise<boolean>;
  modifyCategory: (categoryId: number, name: string) => Promise<boolean>;
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
      return fetchedCategories.reverse();
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async makeNewCategory(newCategoryName: string) {
    try {
      const {
        data: { data: newCategoryId },
      } = await this.categoryAxios.post<{
        data: number;
        error: null;
      }>(routes.server.category, {
        imagePath: "",
        name: newCategoryName,
        useYn: this.useYn,
      });
      return newCategoryId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async fetchDetailedCategoryInfo(categoryId: number) {
    try {
      const {
        data: { data: fetchedCategory },
      } = await this.categoryAxios.get<{
        data: IDetailedCategory;
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

  async modifyCategory(categoryId: number, name: string) {
    try {
      const { status } = await this.categoryAxios.patch(
        routes.server.category,
        {
          categoryId,
          imagePath: "",
          name,
          useYn: this.useYn,
        },
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.categoryModified);
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
