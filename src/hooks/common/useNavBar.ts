import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import authCookieManager from "../../modules/authCookie";
import signAPIManager from "../../modules/signAPI";
import routes from "../../constants/routes";

const useNavBar = () => {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const handleSignOut = useCallback(async () => {
    const isSignOutSuccessful = await signAPIManager.handleSignOut();
    if (!isSignOutSuccessful) authCookieManager.deleteAccessAndRefreshToken();
    navigator(routes.client.signin);
  }, [navigator]);

  return {
    pathname,
    navigator,
    handleSignOut,
  };
};

export default useNavBar;
