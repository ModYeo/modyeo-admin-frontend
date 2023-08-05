import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RequiredInputItem } from "../molcules/SubmitForm";

import useDetailedForm from "../../hooks/common/useDetailedForm";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";
import TextArea from "../atoms/TextArea";
import ReadOnlyInput from "../atoms/ReadOnlyInput";

import routes from "../../constants/routes";
import AnswerDetail from "../../pages/detailed/answer/AnswerDetail";

const ButtonWrapper = styled.div`
  text-align: right;
`;

function DetailedForm<T>({
  path,
  requiredInputItems,
}: {
  path: string;
  requiredInputItems: RequiredInputItem[];
}) {
  const navigator = useNavigate();

  const { pathname } = useLocation();

  const {
    readOnlyItems,
    resetAllItems,
    handleOnClickDeleteBtn,
    submitModifiedData,
  } = useDetailedForm<T>(path, requiredInputItems);

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
        {pathname.includes("inquiry") || (
          <ButtonWrapper>
            <Button type="submit" size="lg" bgColor="blue">
              submit
            </Button>
            &ensp;
            <Button
              type="button"
              size="lg"
              bgColor="red"
              disabled={
                pathname.includes(routes.client.inquiry) ||
                pathname.includes(routes.client.report)
              }
              onClick={handleOnClickDeleteBtn}
            >
              delete
            </Button>
            &ensp;
            <Button
              type="button"
              size="lg"
              bgColor="grey"
              onClick={resetAllItems}
            >
              reset
            </Button>
            &ensp;
            <Button
              type="button"
              size="lg"
              bgColor="grey"
              onClick={() => navigator(-1)}
            >
              back
            </Button>
          </ButtonWrapper>
        )}
      </form>
      {/* TODO: 아래 컴포넌트화 */}
      {readOnlyItems?.map(([itemName, value]) => {
        if (itemName === "answer list") {
          const answerList = value as Record<string, string | number>[];
          return (
            <div key={itemName}>
              {answerList.map((answer) => (
                <AnswerDetail key={answer["answerId"]} answer={answer} />
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
