import React from "react";
import Button from "../atoms/Button";

function SlicePagePerValButtons({
  listLength,
  currentOffset,
  changeOffsetValue,
}: {
  listLength: number;
  currentOffset: number;
  changeOffsetValue: (value: number) => void;
}) {
  return (
    <>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={!currentOffset || currentOffset === 10}
        onClick={() => changeOffsetValue(10)}
      >
        10
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={currentOffset === 20}
        onClick={() => changeOffsetValue(20)}
      >
        20
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={currentOffset === 50}
        onClick={() => changeOffsetValue(50)}
      >
        50
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={currentOffset === listLength}
        onClick={() => changeOffsetValue(listLength)}
      >
        all
      </Button>
    </>
  );
}

export default SlicePagePerValButtons;
