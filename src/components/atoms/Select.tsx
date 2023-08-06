import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { RequiredInputItem } from "./Input";

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

const Label = styled.label`
  font-size: 12px;
`;

const SelectStyle = styled.select`
  padding: 10px 15px;
  border-radius: 5px;
  color: #5476d7;
  border: 1px solid #5476d7;
  appearance: none;
`;

function Select({
  item,
  options,
  onChange,
}: {
  item?: RequiredInputItem;
  options: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const { pathname } = useLocation();

  const selectedOption = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);

  const [currentSelected, setCurrentSelected] = useState(
    item?.defaultValue || "-",
  );

  const { elementId, labelValue } = useMemo(() => {
    if (!item) return { elementId: "id", labelValue: `* select options` };
    const { itemName } = item;
    return {
      elementId: `id-${itemName}`,
      labelValue: `* ${itemName}`,
    };
  }, [item]);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        currentTarget: { value },
      } = e;
      if (item) {
        const {
          refObject: { current },
        } = item;
        if (current instanceof HTMLSelectElement) {
          current.value = value;
          setCurrentSelected(value);
        }
      }
    },
    [item],
  );

  useEffect(() => {
    if (item?.defaultValue) setCurrentSelected(item.defaultValue);
  }, [item?.defaultValue]);

  useEffect(() => {
    if (selectedOption && options.includes(selectedOption))
      setCurrentSelected(selectedOption);
  }, [options, selectedOption]);

  return (
    <Wrapper isReadOnly={item?.isPrimary || item?.disabled}>
      <Label htmlFor={elementId}>{labelValue}</Label>
      &emsp;
      <SelectStyle
        value={currentSelected}
        onChange={onChange || handleOnChange}
        ref={
          item?.refObject && (item.refObject as RefObject<HTMLSelectElement>)
        }
      >
        <option disabled>-</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </SelectStyle>
    </Wrapper>
  );
}

export default Select;
