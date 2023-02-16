import axios, { AxiosInstance } from "axios";
import routes from "../constants/routes";
import serverStatus from "../constants/serverStatus";
import { ICategories } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";

interface ICategoryAPIManager {
  fetchAllCategories: () => Promise<Array<ICategories> | null>;
  makeNewCategory: (newCategoryName: string) => Promise<boolean>;
}

class CategoryAPIManager implements ICategoryAPIManager {
  private categoryAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

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
        data: Array<ICategories>;
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
        useYn: "N",
      });
      // FIX: now this request gets 400 Bad request response.
      if (status === serverStatus.OK) return true;
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }
}

const categoryAPIManager = new CategoryAPIManager(authCookieManager);

export default categoryAPIManager;
