import React, { RefObject } from "react";
import styled from "styled-components";
import { Button, SignInput, Title } from "../../styles/styles";

const FormContainer = styled.div`
  width: 100%;
`;

const Input = styled(SignInput)`
  width: 100%;
  margin: 10px 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  margin: 10px 0;
  padding: 10px;
  resize: none;
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

const Label = styled.label`
  font-size: 12px;
`;

type RequiredInputItems = {
  itemName: string;
  refObject: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  elementType: "input" | "textarea" | "image";
  defaultValue: string | number;
}[];

interface RegisterFormInterface {
  title?: string;
  requiredInputItems: RequiredInputItems;
  isModificationAction?: boolean;
  registerNewElement: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function SubmitForm({
  title,
  requiredInputItems,
  isModificationAction = false,
  registerNewElement,
}: RegisterFormInterface) {
  return (
    <FormContainer>
      {isModificationAction || <Title>{title}</Title>}
      <form onSubmit={registerNewElement}>
        {requiredInputItems.map((item) => {
          const { itemName } = item;
          const elementId = `id-${itemName}`;
          const labelValue = `* ${itemName}`;
          const defaultValue = isModificationAction ? item.defaultValue : "";
          if (item.elementType === "input") {
            return (
              <span key={itemName}>
                <Label htmlFor={elementId}>{labelValue}</Label>
                <Input
                  id={elementId}
                  placeholder={itemName}
                  ref={item.refObject as RefObject<HTMLInputElement>}
                  defaultValue={defaultValue}
                  required
                />
              </span>
            );
          }
          if (item.elementType === "textarea") {
            return (
              <span key={itemName}>
                <Label htmlFor={elementId}>{labelValue}</Label>
                <TextArea
                  placeholder={itemName}
                  ref={item.refObject as RefObject<HTMLTextAreaElement>}
                  defaultValue={defaultValue}
                  required
                />
              </span>
            );
          }
          return (
            <span key={itemName}>
              <Label htmlFor={elementId}>{labelValue}</Label>
              <input
                alt="image input"
                type="image"
                ref={item.refObject as RefObject<HTMLInputElement>}
                required
              />
            </span>
          );
        })}
        <ButtonWrapper>
          <Button type="submit">{`${
            isModificationAction ? "modify" : "register"
          }`}</Button>
        </ButtonWrapper>
      </form>
      <br />
    </FormContainer>
  );
}

export default SubmitForm;
export type { RequiredInputItems };
