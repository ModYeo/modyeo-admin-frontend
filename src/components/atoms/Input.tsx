import React, { RefObject, useMemo } from "react";
import styled from "styled-components";

import { SignInput } from "../../styles/styles";

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

// TODO: get rid of key name optional
type RequiredInputItem = {
  itemName: string;
  name?: string;
  refObject: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  elementType: "input" | "textarea" | "image";
  defaultValue: string | number;
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
    <Wrapper>
      <Label htmlFor={elementId}>{labelValue}</Label>
      <InputElement
        placeholder={item.itemName}
        ref={item.refObject as RefObject<HTMLInputElement>}
        defaultValue={item.defaultValue}
        required
      />
    </Wrapper>
  );
}

export default Input;
export { Label };
export type { RequiredInputItem };
