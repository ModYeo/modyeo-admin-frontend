import React from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import signAPIManager from "../../modules/signAPI";
import {
  NavBarContainer,
  NavBarSection,
  SignButton,
} from "../../styles/styles";

function NavBar() {
  const navigator = useNavigate();
  const handleSignOut = async () => {
    const isSignOutSuccessful = await signAPIManager.handleSignOut();
    if (isSignOutSuccessful) navigator(routes.client.signin);
  };
  return (
    <NavBarContainer>
      <NavBarSection>
        <span>
          <SignButton>ipsum lorem</SignButton>
          <SignButton>ipsum lorem</SignButton>
          <SignButton>ipsum lorem</SignButton>
        </span>
        <span>
          <SignButton onClick={handleSignOut}>sign out</SignButton>
        </span>
      </NavBarSection>
    </NavBarContainer>
  );
}

export default NavBar;
