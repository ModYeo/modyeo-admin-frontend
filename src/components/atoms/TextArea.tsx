import React, { RefObject } from "react";
import styled from "styled-components";

import { Label, RequiredInputItem } from "./Input";

const TextAreaElement = styled.textarea`
  width: 100%;
  height: 120px;
  margin: 10px 0;
  padding: 10px;
  resize: none;
`;

function TextArea({ item }: { item: RequiredInputItem }) {
  const { itemName } = item;
  const elementId = `id-${itemName}`;
  const labelValue = `* ${itemName}`;
  return (
    <span>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <TextAreaElement
        placeholder={itemName}
        ref={item.refObject as RefObject<HTMLTextAreaElement>}
        defaultValue={item.defaultValue}
        required
      />
    </span>
  );
}

export default TextArea;
