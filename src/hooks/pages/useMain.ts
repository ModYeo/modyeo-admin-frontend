import { useCallback, useEffect, useMemo, useState } from "react";
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
  isSideNavBarVisible: boolean;
}

const useMain = (): UseAdmin => {
  const navigator = useNavigate();

  const [isSideNavBarVisible, setIsSideNavBarVisible] = useState(true);

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

  const toggleNavBarByWindowWidth = useCallback(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1220) setIsSideNavBarVisible(false);
      else setIsSideNavBarVisible(true);
    });
  }, []);

  useEffect(() => {
    checkTokensExistence();
  }, [checkTokensExistence]);

  useEffect(() => {
    window.addEventListener("resize", toggleNavBarByWindowWidth);
  }, [toggleNavBarByWindowWidth]);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", toggleNavBarByWindowWidth);
    };
  }, [toggleNavBarByWindowWidth]);

  return {
    currentPath,
    inquiryId,
    isSideNavBarVisible,
  };
};

export default useMain;
