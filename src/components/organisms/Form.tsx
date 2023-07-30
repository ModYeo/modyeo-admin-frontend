import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { RequiredInputItem } from "../molcules/SubmitForm";

import useSubmitForm from "../../hooks/common/useSubmitForm";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";
import TextArea from "../atoms/TextArea";

const ButtonWrapper = styled.div`
  text-align: right;
`;

function Form({
  path,
  requiredInputItems,
}: {
  path: string;
  requiredInputItems: RequiredInputItem[];
}) {
  const navigator = useNavigate();

  const { handleOnSubmit } = useSubmitForm(path, requiredInputItems, "post");

  return (
    <form onSubmit={handleOnSubmit}>
      {requiredInputItems.map((item, idx) => {
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
      <ButtonWrapper>
        <Button type="submit" size="lg" bgColor="blue">
          submit
        </Button>
        &ensp;
        <Button
          type="button"
          size="lg"
          bgColor="red"
          onClick={() => navigator(-1)}
        >
          back
        </Button>
      </ButtonWrapper>
    </form>
  );
}

export default Form;
