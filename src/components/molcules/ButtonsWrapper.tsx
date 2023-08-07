import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../atoms/Button";

const ButtonWrapper = styled.div`
  text-align: right;
`;

function ButtonsWrapper({
  isDisabled,
  deleteElement,
  resetAllItems,
}: {
  isDisabled: boolean;
  deleteElement: () => Promise<unknown>;
  resetAllItems: () => void;
}) {
  const navigator = useNavigate();

  return (
    <ButtonWrapper>
      <Button type="submit" size="lg" bgColor="blue">
        submit
      </Button>
      &ensp;
      <Button
        type="button"
        size="lg"
        bgColor="red"
        disabled={isDisabled}
        onClick={deleteElement}
      >
        delete
      </Button>
      &ensp;
      <Button
        type="button"
        size="lg"
        bgColor="grey"
        disabled={isDisabled}
        onClick={resetAllItems}
      >
        reset
      </Button>
      &ensp;
      <Button
        type="button"
        size="lg"
        bgColor="grey"
        onClick={() => navigator(-1)}
      >
        back
      </Button>
    </ButtonWrapper>
  );
}

export default ButtonsWrapper;
