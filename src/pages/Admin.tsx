import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ColumnCode from "../components/admin/ColumnCode";
import Advertisement from "../components/admin/Advertisement";
import Announcement from "../components/admin/Announcement";
import Category from "../components/admin/Category";
import Report from "../components/admin/Report";
import NavBar from "../components/commons/NavBar";
import routes from "../constants/routes";
import authCookieManager from "../modules/authCookie";
import signAPIManager from "../modules/signAPI";
import { ChosenTabMenuEnum } from "../type/enums";

function showChosenTabMenu(chosenTabMenu: ChosenTabMenuEnum) {
  if (chosenTabMenu === ChosenTabMenuEnum.report) {
    return <Report />;
  }
  if (chosenTabMenu === ChosenTabMenuEnum.announcement) {
    return <Announcement />;
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
  return <div>chose admin tab menu</div>;
}

function Admin() {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const currentPath = pathname.slice(7, pathname.length) as ChosenTabMenuEnum;
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
    navigator(`${routes.client.admin}/${chosenTabMenu}`);
  }, [chosenTabMenu, navigator]);
  return (
    <div>
      <NavBar changeChosenTabMenu={changeChosenTabMenu} />
      {showChosenTabMenu(chosenTabMenu)}
    </div>
  );
}

export default Admin;
