import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authCookieManager from "../../modules/authCookie";
import routes from "../../constants/routes";

export enum ChosenTabMenuEnum {
  category = "category",
  report = "report",
  notice = "notice",
  advertisement = "advertisement",
  columnCode = "columnCode",
  collection = "collection",
  inquiry = "inquiry",
  inquiryDetailed = "inquiryDetailed",
}

const MINIMUN_PATH_LENGTH_START = 7;

interface UseAdmin {
  currentPath: ChosenTabMenuEnum;
  inquiryId?: number;
  checkTokensExistence: () => void;
}

const useAdmin = (): UseAdmin => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const lastIndexOfSlash = useMemo(() => pathname.lastIndexOf("/"), [pathname]);

  const inquiryIdPathParam = Number(
    pathname.slice(lastIndexOfSlash + 1, pathname.length),
  );

  const currentPath = useMemo(
    () =>
      pathname.slice(
        MINIMUN_PATH_LENGTH_START,
        lastIndexOfSlash + 1 === MINIMUN_PATH_LENGTH_START
          ? pathname.length
          : lastIndexOfSlash,
      ) as ChosenTabMenuEnum,
    [pathname, lastIndexOfSlash],
  );

  const inquiryId = useMemo(() => {
    return Number.isInteger(inquiryIdPathParam)
      ? inquiryIdPathParam
      : undefined;
  }, [inquiryIdPathParam]);

  const checkTokensExistence = useCallback(() => {
    const [accessToken, refreshToken] =
      authCookieManager.getAccessAndRefreshTokenFromCookie();
    if (!accessToken || !refreshToken) navigator(routes.client.signin);
  }, [navigator]);

  useEffect(() => {
    checkTokensExistence();
  }, [checkTokensExistence]);

  return {
    currentPath,
    inquiryId,
    checkTokensExistence,
  };
};

export default useAdmin;
