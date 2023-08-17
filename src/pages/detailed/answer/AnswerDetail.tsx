/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";

import useSubmitForm from "../../../hooks/common/useSubmitForm";
import useReadOnlyItems from "../../../hooks/detailed/useReadOnlyItems";
import useDeleteItem from "../../../hooks/detailed/useDeleteItem";

import ReadOnlyInput from "../../../components/atoms/ReadOnlyInput";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import TextArea from "../../../components/atoms/TextArea";

import routes from "../../../constants/routes";

import { RequiredInputItem } from "../../../types";

const AnswerForm = styled.form`
  background-color: #eee;
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

function AnswerDetail({
  answer,
  deleteElementInTheDataArray,
}: {
  answer: Record<string, string | number>;
  deleteElementInTheDataArray: (targetAnswerId: number) => void;
}) {
  const answerIdInputRef = useRef<HTMLInputElement>(null);

  const contentInputRef = useRef<HTMLInputElement>(null);

  const requiredInputItems: RequiredInputItem[] = useMemo(() => {
    return [
      {
        itemName: "answer id",
        name: "answerId",
        refObject: answerIdInputRef,
        elementType: "input",
        defaultValue: "",
        isPrimary: true,
      },
      {
        itemName: "content",
        name: "content",
        refObject: contentInputRef,
        elementType: "textarea",
        defaultValue: "",
      },
    ];
  }, []);

  const answerId = useMemo(() => answer["answerId"] as number, [answer]);

  const isAdminAnswer = useMemo(
    () => answer["authority"] === "ROLE_ADMIN",
    [answer],
  );

  const { handleOnSubmit } = useSubmitForm(
    routes.server.answer,
    requiredInputItems,
    "patch",
  );

  const { readOnlyItems, resetAllItems } = useReadOnlyItems(
    answer,
    requiredInputItems,
  );

  const { handleOnClickDeleteBtn } = useDeleteItem(
    routes.server.answer,
    answerId,
    { willKeepURLAfterDelete: true },
  );

  const deleteAndClearAnswer = useCallback(async () => {
    const isDataDeleteSuccessful = await handleOnClickDeleteBtn();
    if (isDataDeleteSuccessful) deleteElementInTheDataArray(answerId);
  }, [answerId, handleOnClickDeleteBtn, deleteElementInTheDataArray]);

  return (
    <AnswerForm onSubmit={handleOnSubmit}>
      {readOnlyItems?.map(([itemName, value]) => {
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
        if (item.elementType === "textarea") {
          return <TextArea key={item.itemName} item={item} />;
        }
        return null;
      })}
      <ButtonWrapper>
        {isAdminAnswer && (
          <>
            <Button type="submit" size="md" bgColor="blue">
              submit
            </Button>
            &ensp;
            <Button
              type="button"
              size="md"
              bgColor="red"
              onClick={deleteAndClearAnswer}
            >
              delete
            </Button>
            &ensp;
            <Button
              type="button"
              size="md"
              bgColor="grey"
              onClick={resetAllItems}
            >
              reset
            </Button>
          </>
        )}
      </ButtonWrapper>
    </AnswerForm>
  );
}

export default AnswerDetail;
