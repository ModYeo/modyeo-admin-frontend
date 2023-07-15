import React from "react";
import Button from "../atoms/Button";

function SlicePagePerValButtons({
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
    <select onChange={changeOffsetValue} value={currentOffset}>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={listLength}>all</option>
    </select>
  );
}

export default SlicePagePerValButtons;
