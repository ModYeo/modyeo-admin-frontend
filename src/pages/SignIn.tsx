import React from "react";
import { Container, SignButton, SignForm, SignInput } from "../styles/styles";

function SignIn() {
  const handleSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Container>
      <SignForm onSubmit={handleSignInSubmit}>
        <h5>MODYEO ADMIN SERVICE</h5>
        <div>
          <SignInput placeholder="ID" />
        </div>
        <div>
          <SignInput type="password" placeholder="password" />
        </div>
        <SignButton type="submit">submit</SignButton>
      </SignForm>
    </Container>
  );
}

export default SignIn;
