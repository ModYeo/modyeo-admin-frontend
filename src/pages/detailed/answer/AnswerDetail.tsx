import React from "react";
import ReadOnlyInput from "../../../components/atoms/ReadOnlyInput";

function AnswerDetail({ answer }: { answer: Record<string, string | number> }) {
  // console.log(answer);
  return (
    <>
      {Object.keys(answer).map((key) => (
        <ReadOnlyInput
          key={key}
          itemName={String(answer[key])}
          itemValue={String(answer[key])}
        />
      ))}
    </>
  );
}

export default AnswerDetail;
