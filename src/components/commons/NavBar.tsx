import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import authCookieManager from "../../modules/authCookie";
import signAPIManager from "../../modules/signAPI";
import {
  NavBarContainer,
  NavBarSection,
  SignButton,
} from "../../styles/styles";

function NavBar() {
  const navigator = useNavigate();

  const handleSignOut = useCallback(async () => {
    const isSignOutSuccessful = await signAPIManager.handleSignOut();
    if (!isSignOutSuccessful) authCookieManager.deleteAccessAndRefreshToken();
    navigator(routes.client.signin);
  }, [navigator]);

  return (
    <NavBarContainer>
      <NavBarSection>
        <span>
          <SignButton onClick={() => navigator(routes.client.report)}>
            게시글 신고관리
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.notice)}>
            공지 관리
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.category)}>
            카테고리 생성
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.advertisement)}>
            광고 관리
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.columnCode)}>
            컬럼 코드
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.collection)}>
            컬렉션
          </SignButton>
          <SignButton onClick={() => navigator(routes.client.inquiry)}>
            질의 관리
          </SignButton>
        </span>
        <span>
          <SignButton onClick={handleSignOut}>sign out</SignButton>
        </span>
      </NavBarSection>
    </NavBarContainer>
  );
}

export default NavBar;
