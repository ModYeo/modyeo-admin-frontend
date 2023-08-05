import React, { RefObject, useMemo } from "react";
import styled from "styled-components";

import { SignInput } from "../../styles/styles";
import COLOR_CONST from "../../constants/colorConst";

const Wrapper = styled.div<{ isReadOnly?: boolean }>`
  margin: 20px 0;
  padding: 10px;
  background-color: #eee;
  border: 2px solid #eee;
  border-radius: 6px;
  transition: all 0.4s;
  &:hover {
    border: 2px solid
      ${({ isReadOnly }) => (isReadOnly ? "#eee" : COLOR_CONST.BLUE)};
  }
`;

const InputElement = styled(SignInput)`
  width: 100%;
  margin: 10px 0 0 0;
`;

const Label = styled.label`
  font-size: 12px;
`;

// TODO: get rid of key name optional
type RequiredInputItem = {
  itemName: string;
  name?: string;
  refObject: React.RefObject<
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | { file: File | null }
  >;
  elementType: "input" | "textarea" | "image" | "select";
  defaultValue: string | number;
  isPrimary?: boolean;
  disabled?: boolean;
};

function Input({ item }: { item: RequiredInputItem }) {
  const { elementId, labelValue } = useMemo(() => {
    const { itemName } = item;
    return {
      elementId: `id-${itemName}`,
      labelValue: `* ${itemName}`,
    };
  }, [item]);
  return (
    <Wrapper isReadOnly={item?.isPrimary || item?.disabled}>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <InputElement
        placeholder={item.itemName}
        ref={item.refObject as RefObject<HTMLInputElement>}
        defaultValue={item.defaultValue}
        required
        disabled={item?.disabled || item?.isPrimary}
        readOnly={item?.isPrimary}
      />
    </Wrapper>
  );
}

export default Input;
export { Wrapper, Label };
export type { RequiredInputItem };
