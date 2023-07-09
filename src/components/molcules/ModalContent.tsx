import React from "react";

import styled from "styled-components";

import Card, { ObjectType } from "../atoms/Card";
import { Button } from "../../styles/styles";

const ButtonWrapper = styled.div`
  text-align: right;
`;

function ModalContent({
  detailedElement,
  hideModal,
}: {
  detailedElement: ObjectType;
  hideModal: () => void;
}) {
  return (
    <>
      <Card element={detailedElement} />
      <ButtonWrapper>
        <Button onClick={hideModal}>confirm</Button>
      </ButtonWrapper>
    </>
  );
}

export default ModalContent;
