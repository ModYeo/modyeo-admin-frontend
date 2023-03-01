import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import routes from "../constants/routes";
import { toastSentences } from "../constants/toastSentences";
import { IDetailedNotice, INotice } from "../type/types";
import authCookieManager, { AuthCookieManager } from "./authCookie";
import StatusCodeCheckManager from "./statusCode";

interface INoticeAPIManager {
  fetchAllNotices: () => Promise<Array<INotice> | null>;
  makeNewNotice: (content: string, title: string) => Promise<number | null>;
  fetchDetailedNotice: (noticeId: number) => Promise<unknown | null>;
  deleteNotice: (noticeId: number) => Promise<boolean>;
  modifyNotice: (
    noticeId: number,
    content: string,
    title: string,
  ) => Promise<number | null>;
}

class NoticeAPIManager implements INoticeAPIManager {
  private noticeAxios: AxiosInstance;

  private authCookieManager: AuthCookieManager;

  private useYn = "Y";

  constructor(authCookieManagerParam: AuthCookieManager) {
    this.noticeAxios = axios.create();
    this.noticeAxios.interceptors.request.use((config) => {
      const configCopied = { ...config };
      configCopied.headers.Authorization =
        this.authCookieManager.getAccessTokenWithBearer();
      return configCopied;
    });
    this.authCookieManager = authCookieManagerParam;
  }

  async fetchAllNotices() {
    try {
      const {
        data: { data: fetchedNotices },
      } = await this.noticeAxios.get<{ data: Array<INotice> }>(
        routes.server.notice,
      );
      return fetchedNotices.reverse();
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async makeNewNotice(content: string, title: string) {
    try {
      const {
        data: { data: newNoticeId },
      } = await this.noticeAxios.post<{ data: number }>(routes.server.notice, {
        content,
        imagePath: "",
        title,
      });
      return newNoticeId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async fetchDetailedNotice(noticeId: number) {
    try {
      const {
        data: { data: fetchedDetailedNotice },
      } = await this.noticeAxios.get<{ data: IDetailedNotice }>(
        `${routes.server.notice}/${noticeId}`,
      );
      return fetchedDetailedNotice;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async modifyNotice(noticeId: number, content: string, title: string) {
    try {
      const {
        data: { data: modifiedNoticeId },
      } = await this.noticeAxios.patch<{ data: number }>(routes.server.notice, {
        id: noticeId,
        content,
        imagePath: "",
        title,
        useYn: this.useYn,
      });
      // FIX: patch 요청을 보내면 삭제됨.
      return modifiedNoticeId;
    } catch (e) {
      // TODO: show error toast.
      return null;
    }
  }

  async deleteNotice(noticeId: number) {
    try {
      const { status } = await this.noticeAxios.delete(
        `${routes.server.notice}/${noticeId}`,
      );
      if (StatusCodeCheckManager.checkIfIsRequestSucceeded(status)) {
        toast.info(toastSentences.notice.deleted);
        return true;
      }
      throw new Error();
    } catch (e) {
      // TODO: show error toast.
      return false;
    }
  }
}

const noticeAPIManager = new NoticeAPIManager(authCookieManager);

export default noticeAPIManager;
