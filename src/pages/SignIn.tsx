import React from "react";
import useSingnIn from "../hooks/pages/useSignIn";

import {
  Container,
  TabButton,
  SignForm,
  SignInput,
  Title,
} from "../styles/styles";

function SignIn() {
  const { idInputRef, pwInputRef, signinAdminService } = useSingnIn();

  return (
    <Container>
      <SignForm onSubmit={signinAdminService}>
        <Title>MODYEO ADMIN SERVICE</Title>
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
        <TabButton type="submit">submit</TabButton>
      </SignForm>
    </Container>
  );
}

export default SignIn;
