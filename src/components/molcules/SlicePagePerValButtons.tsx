import React from "react";
import Button from "../atoms/Button";

function SlicePagePerValButtons({
  listLength,
  slicePagePerValue,
  choseSlicePagePerValue,
}: {
  listLength: number;
  slicePagePerValue: number;
  choseSlicePagePerValue: (sliceValue: number) => void;
}) {
  return (
    <>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={slicePagePerValue === 10}
        onClick={() => choseSlicePagePerValue(10)}
      >
        10
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={slicePagePerValue === 20}
        onClick={() => choseSlicePagePerValue(20)}
      >
        20
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={slicePagePerValue === 50}
        onClick={() => choseSlicePagePerValue(50)}
      >
        50
      </Button>
      <Button
        bgColor="blue"
        size="sm"
        type="button"
        isChosen={slicePagePerValue === listLength}
        onClick={() => choseSlicePagePerValue(listLength)}
      >
        all
      </Button>
    </>
  );
}

export default SlicePagePerValButtons;
