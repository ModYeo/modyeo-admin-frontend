import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import signAPIManager from "../modules/signAPI";
import routes from "../constants/routes";
import { Container, SignButton, SignForm, SignInput } from "../styles/styles";
import authCookieManager from "../modules/authCookie";

function SignIn() {
  const navigator = useNavigate();
  const idInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };
  useEffect(() => {
    (async () => {
      const isAllTokensValid = await signAPIManager.checkTokensValidation();
      if (isAllTokensValid) navigator(routes.client.admin);
      else authCookieManager.deleteAccessAndRefreshToken();
    })();
  }, [navigator]);
  return (
    <Container>
      <SignForm onSubmit={handleSignInSubmit}>
        <h5>MODYEO ADMIN SERVICE</h5>
        <div>
          <SignInput placeholder="ID" ref={idInputRef} required />
        </div>
        <div>
          <SignInput
            type="password"
            placeholder="password"
            ref={pwInputRef}
            required
          />
        </div>
        <SignButton type="submit">submit</SignButton>
      </SignForm>
    </Container>
  );
}

export default SignIn;
