import React from "react";
import { useLocation } from "react-router-dom";

import { RequiredInputItem } from "../molcules/SubmitForm";

import useDetailedForm from "../../hooks/common/useDetailedForm";

import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";
import TextArea from "../atoms/TextArea";
import ReadOnlyInput from "../atoms/ReadOnlyInput";

import routes from "../../constants/routes";
import AnswerDetail from "../../pages/detailed/answer/AnswerDetail";
import ButtonsWrapper from "../molcules/ButtonsWrapper";

function DetailedForm<T>({
  path,
  requiredInputItems,
  method = "patch",
}: {
  path: string;
  requiredInputItems: RequiredInputItem[];
  method?: "post" | "patch";
}) {
  const { pathname } = useLocation();

  const {
    readOnlyItems,
    resetAllItems,
    handleOnClickDeleteBtn,
    submitModifiedData,
    deleteElementInTheDataArray,
  } = useDetailedForm<T>(path, requiredInputItems, method);

  return (
    <>
      <form onSubmit={submitModifiedData}>
        {readOnlyItems?.map(([itemName, value]) => {
          if (itemName === "answer list") return null;
          return (
            <ReadOnlyInput
              key={itemName}
              itemName={itemName}
              itemValue={String(value)}
            />
          );
        })}
        {requiredInputItems.map((item) => {
          if (item.elementType === "input") {
            return <Input key={item.itemName} item={item} />;
          }
          if (item.elementType === "image") {
            return <ImageInput key={item.itemName} item={item} />;
          }
          if (item.elementType === "textarea") {
            return <TextArea key={item.itemName} item={item} />;
          }
          return null;
        })}
        <ButtonsWrapper
          isDisabled={
            pathname.includes(routes.client.inquiry) ||
            pathname.includes(routes.client.report)
          }
          deleteElement={handleOnClickDeleteBtn}
          resetAllItems={resetAllItems}
        />
      </form>
      {/* TODO: 아래 컴포넌트화 */}
      {readOnlyItems?.map(([itemName, value]) => {
        if (itemName === "answer list") {
          const answerList = value as Record<string, string | number>[];
          return (
            <div key={itemName}>
              {answerList.map((answer) => (
                <AnswerDetail
                  key={answer["answerId"]}
                  answer={answer}
                  deleteElementInTheDataArray={deleteElementInTheDataArray}
                />
              ))}
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default DetailedForm;
