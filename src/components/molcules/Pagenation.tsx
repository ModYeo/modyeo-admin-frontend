import React from "react";
import styled from "styled-components";

import Button from "../atoms/Button";

const ButtonWrapper = styled.div`
  min-height: 30px;
  text-align: right;
`;

function Pagenation({
  filteredListLength,
  pagenationButtonValues,
  currentPage,
  currentOffset,
  changePagenation,
}: {
  filteredListLength: number;
  pagenationButtonValues: (number | string)[];
  currentPage: number;
  currentOffset: number;
  changePagenation: (value: number) => void;
}) {
  console.log(pagenationButtonValues);
  return (
    <ButtonWrapper>
      {filteredListLength > currentOffset &&
        pagenationButtonValues.map((value) => (
          <Button
            key={value as number}
            bgColor="blue"
            size="sm"
            type="button"
            isChosen={currentPage === value}
            onClick={() => changePagenation(value as number)}
          >
            {value}
          </Button>
        ))}
    </ButtonWrapper>
  );
}

export default Pagenation;
