import React, { useEffect } from "react";
import { toast } from "react-toastify";

import TOAST_SENTENCES from "../../constants/toastSentences";

function NoData() {
  useEffect(() => {
    toast.error(TOAST_SENTENCES.DATA_NOT_FOUNT);
  }, []);

  return <h1>데이터를 찾을 수 없습니다. :(</h1>;
}

export default NoData;
