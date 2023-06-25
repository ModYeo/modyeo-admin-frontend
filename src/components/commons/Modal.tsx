import React from "react";
import styled from "styled-components";

const ModalWindow = styled.div`
  width: 700px;
  padding: 25px 25px;
  border-radius: 25px;
  background-color: #eee;
  display: flex;
  justify-content: left;
  align-items: center;
`;

function Modal({ children }: { children: React.ReactNode }) {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  return <ModalWindow onClick={stopPropagation}>{children}</ModalWindow>;
}

export default Modal;
