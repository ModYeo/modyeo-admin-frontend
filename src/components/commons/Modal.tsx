import React, { useEffect } from "react";
import styled from "styled-components";

const ModalWindow = styled.div`
  padding: 25px 25px;
  border-radius: 25px;
  background-color: #eee;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const body = document.querySelector("body");

const lockViewScroll = () => {
  if (body) body.style.overflow = "hidden";
};

const unlockViewScroll = () => {
  if (body) body.style.overflow = "visible";
};

function Modal({ children }: { children: React.ReactNode }) {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  useEffect(() => {
    lockViewScroll();
    return () => unlockViewScroll();
  }, []);
  return <ModalWindow onClick={stopPropagation}>{children}</ModalWindow>;
}

export default Modal;
