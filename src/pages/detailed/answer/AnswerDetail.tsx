import React, { useMemo, useRef } from "react";
import styled from "styled-components";

import ReadOnlyInput from "../../../components/atoms/ReadOnlyInput";
import Input, { RequiredInputItem } from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import TextArea from "../../../components/atoms/TextArea";

const AnswerForm = styled.form`
  background-color: #eee;
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

function AnswerDetail({ answer }: { answer: Record<string, string | number> }) {
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

  console.log(answer);

  return (
    <AnswerForm>
      {Object.keys(answer).map((key) => {
        if (key === "answerId" || key === "content") return null;
        return (
          <ReadOnlyInput
            key={key}
            itemName={key}
            itemValue={String(answer[key])}
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
        <Button type="submit" size="md" bgColor="blue">
          submit
        </Button>
        &ensp;
        <Button type="button" size="md" bgColor="red">
          delete
        </Button>
        &ensp;
        <Button type="button" size="md" bgColor="grey">
          reset
        </Button>
        &ensp;
        <Button type="button" size="md" bgColor="grey">
          back
        </Button>
      </ButtonWrapper>
    </AnswerForm>
  );
}

export default AnswerDetail;
