import { useCallback, useEffect, useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";

import signAPIManager from "../../modules/signAPI";
import routes from "../../constants/routes";

interface UseNavBar {
  isWindowScrollOnTop: boolean;
  pathname: string;
  navigator: NavigateFunction;
  handleSignOut: () => Promise<void>;
}

const useNavBar = (): UseNavBar => {
  const navigator = useNavigate();

  const [isWindowScrollOnTop, setIsWindowScrollOnTop] = useState(true);

  const { pathname } = useLocation();

  const handleSignOut = useCallback(async () => {
    const isSignOutSuccessful = await signAPIManager.requestSignOut();
    if (isSignOutSuccessful) navigator(routes.client.signin);
  }, [navigator]);

  const checkIsWindowOnTop = useCallback(() => {
    window.addEventListener("scroll", () => {
      const {
        documentElement: { scrollTop: scrollDowned },
      } = document;
      if (scrollDowned) setIsWindowScrollOnTop(false);
      else setIsWindowScrollOnTop(true);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkIsWindowOnTop);
    return () => {
      window.removeEventListener("scroll", checkIsWindowOnTop);
    };
  }, [checkIsWindowOnTop]);

  return {
    isWindowScrollOnTop,
    pathname,
    navigator,
    handleSignOut,
  };
};

export default useNavBar;
