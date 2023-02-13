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
          <SignButton>게시글 신고관리</SignButton>
          <SignButton>공지 관리</SignButton>
          <SignButton>카테고리 생성</SignButton>
        </span>
        <span>
          <SignButton onClick={handleSignOut}>sign out</SignButton>
        </span>
      </NavBarSection>
    </NavBarContainer>
  );
}

export default NavBar;
