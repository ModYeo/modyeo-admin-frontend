import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RequiredInputItem } from "../molcules/SubmitForm";

import useDetailedForm from "../../hooks/common/useDetailedForm";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import ImageInput from "../atoms/ImageInput";
import TextArea from "../atoms/TextArea";
import ReadOnlyInput from "../atoms/ReadOnlyInput";

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

  const { detailedData, readOnlyItems } = useDetailedForm<T>(
    path,
    requiredInputItems,
  );

  return (
    <form>
      {readOnlyItems?.map(([itemName, value]) => (
        <ReadOnlyInput
          key={itemName as string}
          itemName={itemName as string}
          itemValue={value as string}
        />
      ))}
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
      <ButtonWrapper>
        <Button type="submit" size="lg" bgColor="blue">
          submit
        </Button>
        &ensp;
        <Button type="button" size="lg" bgColor="red">
          delete
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
    </form>
  );
}

export default DetailedForm;
