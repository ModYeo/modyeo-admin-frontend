import React from "react";
import styled from "styled-components";
import NavBar from "../components/commons/NavBar";
import ColumnCode from "../components/organisms/ColumnCode";
import Advertisement from "../components/organisms/Advertisement";
import Category from "../components/organisms/Category";
import Report from "../components/organisms/Report";
import Notice from "../components/organisms/Notice";
import Collection from "../components/organisms/Collection";
import Inquiry from "../components/organisms/Inquiry";
import InquiryDetail from "./InquiryDetail";
import useAdmin, { ChosenTabMenuEnum } from "../hooks/pages/useAdmin";

const Greetings = styled.h1`
  margin-top: 300px;
  text-align: center;
`;

function showChosenTabMenu(
  chosenTabMenu: ChosenTabMenuEnum,
  pathParam?: number,
) {
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
  return <Greetings>관리할 항목을 위의 메뉴에서 선택하세요</Greetings>;
}

function Admin() {
  const { currentPath, inquiryId } = useAdmin();

  return (
    <div>
      <NavBar />
      {showChosenTabMenu(currentPath, inquiryId)}
    </div>
  );
}

export default Admin;
