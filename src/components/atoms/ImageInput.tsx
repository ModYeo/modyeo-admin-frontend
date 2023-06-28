import React from "react";
import styled from "styled-components";

import { Label, RequiredInputItem } from "./Input";

const ImageFileDiv = styled.div``;

function ImageInput({
  item,
  isModificationAction,
}: {
  item: RequiredInputItem;
  isModificationAction: boolean;
}) {
  const { itemName } = item;
  const elementId = `id-${itemName}`;
  const labelValue = `* ${itemName}`;
  return (
    <ImageFileDiv>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <input type="file" accept="image/*" />
      <button type="button">선택</button>
      <button type="button">초기화</button>
    </ImageFileDiv>
  );
}

export default ImageInput;
