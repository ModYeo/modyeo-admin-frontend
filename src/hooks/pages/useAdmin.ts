import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authCookieManager from "../../modules/authCookie";
import routes from "../../constants/routes";
import { ChosenTabMenuEnum } from "../../type/enums";

const MINIMUN_PATH_LENGTH_START = 7;

interface UseAdmin {
  currentPath: ChosenTabMenuEnum;
  inquiryId: number;
  checkTokensExistence: () => void;
}

const useAdmin = (): UseAdmin => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const lastIndexOfSlash = pathname.lastIndexOf("/");

  const currentPath = pathname.slice(
    MINIMUN_PATH_LENGTH_START,
    lastIndexOfSlash + 1 === MINIMUN_PATH_LENGTH_START
      ? pathname.length
      : lastIndexOfSlash,
  ) as ChosenTabMenuEnum;

  const inquiryId = Number(
    pathname.slice(lastIndexOfSlash + 1, pathname.length),
  );

  const checkTokensExistence = useCallback(() => {
    const [accessToken, refreshToken] =
      authCookieManager.getAccessAndRefreshTokenFromCookie();
    if (!accessToken || !refreshToken) navigator(routes.client.signin);
  }, [navigator]);

  return {
    currentPath,
    inquiryId,
    checkTokensExistence,
  };
};

export default useAdmin;
