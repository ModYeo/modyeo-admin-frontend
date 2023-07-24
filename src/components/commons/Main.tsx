import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import useCheckTokenValidation from "../../hooks/common/useCheckTokenValidation";

import SideNavBar from "./SideNavBar";
import NavBar from "./NavBar";

function Main() {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1220);

  const { checkTokensValidation } = useCheckTokenValidation();

  const toggleNavBarByWindowWidth = useCallback(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1220) setIsWideScreen(false);
      else setIsWideScreen(true);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", toggleNavBarByWindowWidth);
  }, [toggleNavBarByWindowWidth]);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", toggleNavBarByWindowWidth);
    };
  }, [toggleNavBarByWindowWidth]);

  useEffect(() => {
    checkTokensValidation();
  }, [checkTokensValidation]);

  return (
    <div style={{ display: "flex", minWidth: "600px" }}>
      {isWideScreen ? (
        <div style={{ width: "200px", height: "10px" }}>
          <SideNavBar />
        </div>
      ) : (
        <NavBar />
      )}
      <div style={{ width: "100%" }}>
        <div style={{ width: "80%", margin: "auto", padding: "100px 0" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
