import React, { useCallback, useMemo } from "react";

import styled from "styled-components";

import useAdmin, { ChosenTabMenuEnum } from "../hooks/pages/useAdmin";

import NavBar from "../components/commons/NavBar";
import ColumnCode from "../components/organisms/ColumnCode";
import Advertisement from "../components/organisms/Advertisement";
import Category from "../components/organisms/Category";
import Report from "../components/organisms/Report";
import Notice from "../components/organisms/Notice";
import Collection from "../components/organisms/Collection";
import Inquiry from "../components/organisms/Inquiry";
import InquiryDetail from "./InquiryDetail";
import SideNavBar from "../components/commons/SideNavBar";
import Button from "../components/atoms/Button";

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ListContentWrapper = styled(PageWrapper)`
  width: 100%;
  justify-content: center;
`;

const Greetings = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Admin() {
  const { currentPath, inquiryId, isSideNavBarVisible } = useAdmin();

  const showChosenTabMenu = useCallback(
    (chosenTabMenu: ChosenTabMenuEnum, pathParam?: number) => {
      if (chosenTabMenu === ChosenTabMenuEnum.report) {
        return <Report />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.notice) {
        return <Notice />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.category) {
        return <Category />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.advertisement) {
        return <Advertisement />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.columnCode) {
        return <ColumnCode />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.collection) {
        return <Collection />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.inquiry && pathParam) {
        return <InquiryDetail />;
      }
      if (chosenTabMenu === ChosenTabMenuEnum.inquiry) {
        return <Inquiry />;
      }
      return <Greetings>관리할 항목을 메뉴에서 선택하세요</Greetings>;
    },
    [],
  );

  const currentPage = useMemo(
    () => showChosenTabMenu(currentPath, inquiryId),
    [currentPath, inquiryId, showChosenTabMenu],
  );

  return (
    <PageWrapper>
      {isSideNavBarVisible ? <SideNavBar /> : <NavBar />}
      <ListContentWrapper>{currentPage}</ListContentWrapper>
      <Button size="lg" bgColor="blue" type="button">
        hi
      </Button>
    </PageWrapper>
  );
}

export default Admin;
