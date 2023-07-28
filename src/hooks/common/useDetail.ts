import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useDetail = () => {
  const { pathname } = useLocation();

  const navigator = useNavigate();

  const elementId = useMemo(() => pathname.split("/")[2], [pathname]);

  useEffect(() => {}, []);

  return {};
};

export default useDetail;
