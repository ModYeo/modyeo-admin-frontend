import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { RequiredInputItem } from "../molcules/SubmitForm";

import useSubmitForm from "../../hooks/common/useSubmitForm";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";

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
  const { handleOnSubmit } = useSubmitForm(path, requiredInputItems);

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
          return <ImageInput key={item.itemName} item={item} />;
        }
        return null;
      })}
      <ButtonWrapper>
        <Button type="submit" size="lg" bgColor="blue">
          submit
        </Button>
        &ensp;
        <Link to="/category">
          <Button type="button" size="lg" bgColor="red">
            back
          </Button>
        </Link>
      </ButtonWrapper>
    </form>
  );
}

export default Form;
