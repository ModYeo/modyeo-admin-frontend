import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/commons/NavBar";
import routes from "../constants/routes";
import authCookieManager from "../modules/authCookie";
import signAPIManager from "../modules/signAPI";

function Admin() {
  const navigator = useNavigate();
  useEffect(() => {
    const isAllTokensValid = signAPIManager.checkTokensValidation();
    if (!isAllTokensValid) {
      authCookieManager.deleteAccessAndRefreshToken();
      navigator(routes.client.signin);
    }
  }, [navigator]);
  return (
    <div>
      <NavBar />
    </div>
  );
}

export default Admin;
