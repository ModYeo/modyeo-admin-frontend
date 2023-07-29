import React from "react";
import styled from "styled-components";

import { SignInput } from "../../styles/styles";

// TODO: 스타일 정리
const Wrapper = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #eee;
  border-radius: 6px;
`;

const InputElement = styled(SignInput)`
  width: 100%;
  margin: 10px 0 0 0;
`;

const Label = styled.label`
  font-size: 12px;
`;

function ReadOnlyInput({
  itemName,
  itemValue,
}: {
  itemName: string;
  itemValue: string;
}) {
  return (
    <Wrapper>
      <Label htmlFor={itemName}>* {itemName}</Label>
      <InputElement defaultValue={itemValue} readOnly disabled />
    </Wrapper>
  );
}

export default ReadOnlyInput;
