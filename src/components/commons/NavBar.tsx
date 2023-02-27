import React from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import authCookieManager from "../../modules/authCookie";
import signAPIManager from "../../modules/signAPI";
import {
  NavBarContainer,
  NavBarSection,
  SignButton,
} from "../../styles/styles";
import { ChosenTabMenuEnum } from "../../type/enums";

function NavBar({
  changeChosenTabMenu,
}: {
  changeChosenTabMenu: (tabMenu: ChosenTabMenuEnum) => void;
}) {
  const navigator = useNavigate();
  const handleSignOut = async () => {
    const isSignOutSuccessful = await signAPIManager.handleSignOut();
    if (!isSignOutSuccessful) authCookieManager.deleteAccessAndRefreshToken();
    navigator(routes.client.signin);
  };
  return (
    <NavBarContainer>
      <NavBarSection>
        <span>
          <SignButton
            onClick={() => changeChosenTabMenu(ChosenTabMenuEnum.report)}
          >
            게시글 신고관리
          </SignButton>
          <SignButton
            onClick={() => changeChosenTabMenu(ChosenTabMenuEnum.notice)}
          >
            공지 관리
          </SignButton>
          <SignButton
            onClick={() => changeChosenTabMenu(ChosenTabMenuEnum.category)}
          >
            카테고리 생성
          </SignButton>
          <SignButton
            onClick={() => changeChosenTabMenu(ChosenTabMenuEnum.advertisement)}
          >
            광고 관리
          </SignButton>
          <SignButton
            onClick={() => changeChosenTabMenu(ChosenTabMenuEnum.columnCode)}
          >
            컬럼 코드
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
