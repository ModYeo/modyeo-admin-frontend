import React from "react";
import styled from "styled-components";

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

const SideButton = styled.button`
  width: 100%;
  height: 50px;
  padding-left: 6px;
  border-right: 6px solid #f7f7f7;
  &:hover {
    color: #5476d7;
    border-right: 6px solid #5476d7;
    box-sizing: border-box;
  }
`;

const SideNavBarWrapper = styled.div`
  width: 200px;
  height: 100vh;
`;

function SideNavBar() {
  return (
    <SideNavBarWrapper>
      <SideNavBarContainer>
        <div>
          <SideButton>게시글 신고관리</SideButton>
          <SideButton>공지 관리</SideButton>
          <SideButton>카테고리 생성</SideButton>
          <SideButton>광고 관리</SideButton>
          <SideButton>컬럼 코드</SideButton>
          <SideButton>컬렉션</SideButton>
          <SideButton>질의 관리</SideButton>
        </div>
        <div>
          <SideButton>로그아웃</SideButton>
        </div>
      </SideNavBarContainer>
    </SideNavBarWrapper>
  );
}

export default SideNavBar;
