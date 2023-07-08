import React, { RefObject, useMemo } from "react";
import styled from "styled-components";

import { SignInput } from "../../styles/styles";

const InputElement = styled(SignInput)`
  width: 100%;
  margin: 10px 0;
`;

const Label = styled.label`
  font-size: 12px;
`;

type RequiredInputItem = {
  itemName: string;
  refObject: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | { file: File | null }
  >;
  elementType: "input" | "textarea" | "image";
  defaultValue: string | number;
};

function Input({
  item,
  isModificationAction,
}: {
  item: RequiredInputItem;
  isModificationAction: boolean;
}) {
  const { elementId, labelValue, defaultValue } = useMemo(() => {
    const { itemName } = item;
    return {
      elementId: `id-${itemName}`,
      labelValue: `* ${itemName}`,
      defaultValue: isModificationAction ? item.defaultValue : "",
    };
  }, [item, isModificationAction]);
  return (
    <span>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <InputElement
        placeholder={item.itemName}
        ref={item.refObject as RefObject<HTMLInputElement>}
        defaultValue={defaultValue}
        required
      />
    </span>
  );
}

export default Input;
export { Label };
export type { RequiredInputItem };
