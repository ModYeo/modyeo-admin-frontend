import React from "react";
import useSingnIn from "../hooks/pages/useSignIn";

import { Container, TabButton, SignForm, SignInput } from "../styles/styles";

function SignIn() {
  const { idInputRef, pwInputRef, signinAdminService } = useSingnIn();

  return (
    <Container>
      <SignForm onSubmit={signinAdminService}>
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
        <TabButton type="submit">submit</TabButton>
      </SignForm>
    </Container>
  );
}

export default SignIn;
