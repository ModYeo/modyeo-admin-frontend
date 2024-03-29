import React from "react";
import { useLocation } from "react-router-dom";

import useDetailedForm from "../../hooks/common/useDetailedForm";

import AnswerDetail from "../../pages/detailed/answer/AnswerDetail";

import ButtonsWrapper from "../molcules/ButtonsWrapper";
import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";
import TextArea from "../atoms/TextArea";
import ReadOnlyInput from "../atoms/ReadOnlyInput";
import Select from "../atoms/Select";

import routes from "../../constants/routes";

import { RequiredInputItem } from "../../types";

function DetailedForm<T>({
  path,
  subPath,
  requiredInputItems,
  method = "patch",
  onSubmit,
}: {
  path: string;
  subPath?: string;
  requiredInputItems: RequiredInputItem[];
  method?: "post" | "patch";
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { pathname } = useLocation();

  const {
    readOnlyItems,
    imagePath,
    resetAllItems,
    handleOnClickDeleteBtn,
    submitModifiedData,
    deleteElementInTheDataArray,
  } = useDetailedForm<T>(path, requiredInputItems, method, subPath);

  return (
    <>
      <form onSubmit={onSubmit || submitModifiedData}>
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
            return (
              <ImageInput
                key={item.itemName}
                item={item}
                imagePath={imagePath}
              />
            );
          }
          if (item.elementType === "textarea") {
            return <TextArea key={item.itemName} item={item} />;
          }
          if (item.elementType === "select" && item?.options) {
            return (
              <Select key={item.itemName} item={item} options={item.options} />
            );
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
