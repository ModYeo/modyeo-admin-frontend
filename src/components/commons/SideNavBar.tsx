import React from "react";
import styled from "styled-components";

import routes from "../../constants/routes";
import useNavBar from "../../hooks/common/useNavBar";

const SideNavBarContainer = styled.div`
  background-color: #f7f7f7;
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SideButton = styled.button<{ isChosenTab?: boolean }>`
  width: 100%;
  height: 50px;
  padding-left: 6px;
  border-right: 6px solid
    ${({ isChosenTab }) => (isChosenTab ? "#5476d7" : "#f7f7f7")};
  &:hover {
    color: #5476d7;
    border-right: 6px solid #5476d7;
    box-sizing: border-box;
  }
`;

const SideNavBarWrapper = styled.div`
  width: 200px;
`;

function SideNavBar() {
  const { pathname, navigator, handleSignOut } = useNavBar();
  return (
    <SideNavBarWrapper>
      <SideNavBarContainer>
        <div>
          <SideButton
            isChosenTab={pathname.includes(routes.client.report)}
            onClick={() => navigator(routes.client.report)}
          >
            게시글 신고관리
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.notice)}
            onClick={() => navigator("/notice")}
          >
            공지 관리
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.category)}
            onClick={() => navigator("/category")}
          >
            카테고리
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.advertisement)}
            onClick={() => navigator(routes.client.advertisement)}
          >
            광고 관리
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.columnCode)}
            onClick={() => navigator(routes.client.columnCode)}
          >
            컬럼 코드
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.collection)}
            onClick={() => navigator(routes.client.collection)}
          >
            컬렉션
          </SideButton>
          <SideButton
            isChosenTab={pathname.includes(routes.client.inquiry)}
            onClick={() => navigator(routes.client.inquiry)}
          >
            질의 관리
          </SideButton>
        </div>
        <div>
          <SideButton onClick={handleSignOut}>로그아웃</SideButton>
        </div>
      </SideNavBarContainer>
    </SideNavBarWrapper>
  );
}

export default SideNavBar;
