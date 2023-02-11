import React from "react";
import {
  NavBarContainer,
  NavBarSection,
  SignButton,
} from "../../styles/styles";

function NavBar() {
  return (
    <NavBarContainer>
      <NavBarSection>
        <span>
          <SignButton>ipsum lorem</SignButton>
          <SignButton>ipsum lorem</SignButton>
          <SignButton>ipsum lorem</SignButton>
        </span>
        <span>
          <SignButton>sign out</SignButton>
        </span>
      </NavBarSection>
    </NavBarContainer>
  );
}

export default NavBar;
