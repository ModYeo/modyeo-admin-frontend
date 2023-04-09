import React from "react";
import NavBar from "../components/commons/NavBar";
import ColumnCode from "../components/admin/ColumnCode";
import Advertisement from "../components/admin/Advertisement";
import Category from "../components/admin/Category";
import Report from "../components/admin/Report";
import Notice from "../components/admin/Notice";
import Collection from "../components/admin/Collection";
import Inquiry from "../components/admin/Inquiry";
import InquiryDetail from "./InquiryDetail";
import useAdmin, { ChosenTabMenuEnum } from "../hooks/pages/useAdmin";

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
  return <div>chose admin tab menu</div>;
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
