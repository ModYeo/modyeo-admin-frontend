import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/commons/NavBar";
import ColumnCode from "../components/admin/ColumnCode";
import Advertisement from "../components/admin/Advertisement";
import Category from "../components/admin/Category";
import Report from "../components/admin/Report";
import { ChosenTabMenuEnum } from "../type/enums";
import Notice from "../components/admin/Notice";
import Collection from "../components/admin/Collection";
import Inquiry from "../components/admin/Inquiry";
import InquiryDetail from "./InquiryDetail";
import authCookieManager from "../modules/authCookie";
import routes from "../constants/routes";

const MINIMUN_PATH_LENGTH_START = 7;

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
    return <InquiryDetail inquiryId={pathParam} />;
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
  const inquiryId = Number(
    pathname.slice(lastIndexOfSlash + 1, pathname.length),
  );
  const currentPath = pathname.slice(
    MINIMUN_PATH_LENGTH_START,
    lastIndexOfSlash + 1 === MINIMUN_PATH_LENGTH_START
      ? pathname.length
      : lastIndexOfSlash,
  ) as ChosenTabMenuEnum;
  useEffect(() => {
    const [accessToken, refreshToken] =
      authCookieManager.getAccessAndRefreshTokenFromCookie();
    if (!accessToken || !refreshToken) navigator(routes.client.signin);
  }, [navigator]);
  return (
    <div>
      <NavBar />
      {showChosenTabMenu(
        currentPath,
        Number.isInteger(inquiryId) ? inquiryId : undefined,
      )}
    </div>
  );
}

export default Admin;
