import React from "react";
import useNavBar from "../../hooks/common/useNavBar";
import { NavBarContainer, NavBarSection, TabButton } from "../../styles/styles";

import routes from "../../constants/routes";

function NavBar() {
  const { isWindowScrollOnTop, pathname, navigator, handleSignOut } =
    useNavBar();

  return (
    <NavBarContainer isWindowScrollOnTop={isWindowScrollOnTop}>
      <NavBarSection>
        <span>
          <TabButton
            isChosenTab={pathname === routes.client.report}
            onClick={() => navigator(routes.client.report)}
          >
            게시글 신고관리
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.notice}
            onClick={() => navigator(routes.client.notice)}
          >
            공지 관리
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.category}
            onClick={() => navigator(routes.client.category)}
          >
            카테고리 생성
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.advertisement}
            onClick={() => navigator(routes.client.advertisement)}
          >
            광고 관리
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.columnCode}
            onClick={() => navigator(routes.client.columnCode)}
          >
            컬럼 코드
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.collection}
            onClick={() => navigator(routes.client.collection)}
          >
            컬렉션
          </TabButton>
          <TabButton
            isChosenTab={pathname === routes.client.inquiry}
            onClick={() => navigator(routes.client.inquiry)}
          >
            질의 관리
          </TabButton>
        </span>
        <span>
          <TabButton onClick={handleSignOut}>로그아웃</TabButton>
        </span>
      </NavBarSection>
    </NavBarContainer>
  );
}

export default NavBar;
