import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import signAPIManager from "../apis/signAPI";
import routes from "../constants/routes";
import { Container, SignButton, SignForm, SignInput } from "../styles/styles";

function SignIn() {
  const navigatior = useNavigate();
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
      if (isSignInSuccessful) navigatior(routes.client.admin);
    }
  };

  return (
    <Container>
      <SignForm onSubmit={handleSignInSubmit}>
        <h5>MODYEO ADMIN SERVICE</h5>
        <div>
          <SignInput placeholder="ID" ref={idInputRef} />
        </div>
        <div>
          <SignInput type="password" placeholder="password" ref={pwInputRef} />
        </div>
        <SignButton type="submit">submit</SignButton>
      </SignForm>
    </Container>
  );
}

export default SignIn;
