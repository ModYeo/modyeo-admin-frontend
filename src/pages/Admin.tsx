import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ColumnCode from "../components/admin/ColumnCode";
import Advertisement from "../components/admin/Advertisement";
import Category from "../components/admin/Category";
import Report from "../components/admin/Report";
import NavBar from "../components/commons/NavBar";
import routes from "../constants/routes";
import authCookieManager from "../modules/authCookie";
import signAPIManager from "../modules/signAPI";
import { ChosenTabMenuEnum } from "../type/enums";
import Notice from "../components/admin/Notice";
import Collection from "../components/admin/Collection";
import Inquiry from "../components/admin/Inquiry";
import InquiryDetail from "../components/admin/InquiryDetail";

function showChosenTabMenu(
  chosenTabMenu: ChosenTabMenuEnum,
  pathParam?: number,
) {
  // console.log(chosenTabMenu);
  // console.log(ChosenTabMenuEnum.inquiry);
  // console.log(!Number.isNaN(pathParam));
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
  if (chosenTabMenu === ChosenTabMenuEnum.inquiry && !Number.isNaN(pathParam)) {
    return <InquiryDetail />;
  }
  if (chosenTabMenu === ChosenTabMenuEnum.inquiry) {
    return <Inquiry />;
  }
  return <div>chose admin tab menu</div>;
}

function Admin() {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const lastIndexOfSlash = pathname.lastIndexOf("/");
  const inquiryNo = Number(
    pathname.slice(lastIndexOfSlash + 1, pathname.length),
  );
  const currentPath = pathname.slice(
    7,
    lastIndexOfSlash === -1 ? pathname.length : lastIndexOfSlash,
  ) as ChosenTabMenuEnum;
  // FIX: currentPath 올바른 값 내기.
  console.log(lastIndexOfSlash);
  console.log(inquiryNo);
  const [chosenTabMenu, setChosenTabMenu] = useState(currentPath);
  const changeChosenTabMenu = (tabMenu: ChosenTabMenuEnum) => {
    setChosenTabMenu(tabMenu);
  };
  useEffect(() => {
    const isAllTokensValid = signAPIManager.checkTokensValidation();
    if (!isAllTokensValid) {
      authCookieManager.deleteAccessAndRefreshToken();
      navigator(routes.client.signin);
    }
  }, [navigator]);
  useEffect(() => {
    if (chosenTabMenu === ChosenTabMenuEnum.inquiry) {
      navigator(
        `${routes.client.admin}/${ChosenTabMenuEnum.inquiry}${
          Number.isNaN(inquiryNo) ? "" : `/${inquiryNo}`
        }`,
      );
    } else navigator(`${routes.client.admin}/${chosenTabMenu}`);
  }, [chosenTabMenu, inquiryNo, navigator]);
  return (
    <div>
      <NavBar changeChosenTabMenu={changeChosenTabMenu} />
      {showChosenTabMenu(chosenTabMenu, inquiryNo)}
    </div>
  );
}

export default Admin;
