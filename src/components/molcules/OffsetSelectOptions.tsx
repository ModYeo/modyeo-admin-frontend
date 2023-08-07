import React from "react";
import styled from "styled-components";

import COLOR_CONST from "../../constants/colorConst";

const Select = styled.select`
  padding: 3px 6px;
  border: 1px solid ${COLOR_CONST.BLUE};
  border-radius: 6px;
`;

function OffsetSelectOptions({
  listLength,
  currentOffset,
  changeOffsetValue,
}: {
  listLength: number;
  currentOffset: number;
  changeOffsetValue: ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <Select
      onChange={changeOffsetValue}
      value={currentOffset}
      disabled={listLength <= 10}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={listLength}>all</option>
    </Select>
  );
}

export default OffsetSelectOptions;
