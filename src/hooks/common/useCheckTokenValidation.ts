import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import signAPIManager from "../../modules/signAPI";

const useCheckTokenValidation = () => {
  const navigator = useNavigate();

  const checkTokensValidation = useCallback(async () => {
    const isAllTokensValid = await signAPIManager.checkTokensValidation();
    if (!isAllTokensValid) navigator("/signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { checkTokensValidation };
};

export default useCheckTokenValidation;
