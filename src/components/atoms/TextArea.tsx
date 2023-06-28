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

function TextArea({
  item,
  isModificationAction,
}: {
  item: RequiredInputItem;
  isModificationAction: boolean;
}) {
  const { itemName } = item;
  const elementId = `id-${itemName}`;
  const labelValue = `* ${itemName}`;
  const defaultValue = isModificationAction ? item.defaultValue : "";
  return (
    <span>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <TextAreaElement
        placeholder={itemName}
        ref={item.refObject as RefObject<HTMLTextAreaElement>}
        defaultValue={defaultValue}
        required
      />
    </span>
  );
}

export default TextArea;
