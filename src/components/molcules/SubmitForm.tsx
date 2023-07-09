import React from "react";
import styled from "styled-components";

import Input, { RequiredInputItem } from "../atoms/Input";
import TextArea from "../atoms/TextArea";

import { Button, Title } from "../../styles/styles";
import ImageInput from "../atoms/ImageInput";

const FormContainer = styled.div`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  text-align: right;
  padding: 10px 0;
`;

interface RegisterFormInterface {
  title?: string;
  requiredInputItems: RequiredInputItem[];
  isModificationAction?: boolean;
  registerNewElement: (
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void> | void;
  hideModal?: () => void;
}

function SubmitForm({
  title,
  requiredInputItems,
  isModificationAction = false,
  registerNewElement,
  hideModal,
}: RegisterFormInterface) {
  return (
    <FormContainer>
      {isModificationAction || <Title>{title}</Title>}
      <form onSubmit={registerNewElement}>
        {requiredInputItems.map((item) => {
          if (item.elementType === "input") {
            return (
              <Input
                key={item.itemName}
                item={item}
                isModificationAction={isModificationAction}
              />
            );
          }
          if (item.elementType === "textarea") {
            return (
              <TextArea
                key={item.itemName}
                item={item}
                isModificationAction={isModificationAction}
              />
            );
          }
          if (item.elementType === "image") {
            return (
              <ImageInput
                key={item.itemName}
                item={item}
                isModificationAction={isModificationAction}
              />
            );
          }
          return null;
        })}
        <ButtonWrapper>
          {isModificationAction ? (
            <>
              <Button>modify</Button>
              <Button type="button" onClick={hideModal}>
                cancel
              </Button>
            </>
          ) : (
            <Button>register</Button>
          )}
        </ButtonWrapper>
      </form>
    </FormContainer>
  );
}

export default SubmitForm;
export type { RequiredInputItem };
