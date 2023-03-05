import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";

function InquiryDetail() {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    (() => {
      const inquiryNo = Number(
        pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length),
      );
      if (!Number.isNaN(inquiryNo)) {
        // TODO: call api.
        console.log("call api");
      }
    })();
  }, [navigator, pathname]);
  return (
    <div>
      inquiry detail
      <button
        type="button"
        onClick={() => navigator(routes.server.inquiry.index)}
      >
        back
      </button>
    </div>
  );
}

export default InquiryDetail;
