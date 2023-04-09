import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authCookieManager from "../../modules/authCookie";
import signAPIManager from "../../modules/signAPI";
import routes from "../../constants/routes";

interface UseSignIn {
  idInputRef: React.RefObject<HTMLInputElement>;
  pwInputRef: React.RefObject<HTMLInputElement>;
  signinAdminService: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useSingnIn = (): UseSignIn => {
  const navigator = useNavigate();

  const idInputRef = useRef<HTMLInputElement>(null);

  const pwInputRef = useRef<HTMLInputElement>(null);

  const checkTokensValidation = useCallback(async () => {
    const isAllTokensValid = await signAPIManager.checkTokensValidation();
    if (isAllTokensValid) navigator(routes.client.admin);
    else authCookieManager.deleteAccessAndRefreshToken();
  }, [navigator]);

  const signinAdminService = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const idCurrent = idInputRef.current;
      const pwCurrent = pwInputRef.current;
      if (idCurrent && pwCurrent) {
        const isSignInSuccessful = await signAPIManager.handleSignIn(
          idCurrent.value,
          pwCurrent.value,
        );
        if (isSignInSuccessful) navigator(routes.client.admin);
      }
    },
    [navigator],
  );

  useEffect(() => {
    checkTokensValidation();
  }, [checkTokensValidation]);

  return { idInputRef, pwInputRef, signinAdminService };
};

export default useSingnIn;
