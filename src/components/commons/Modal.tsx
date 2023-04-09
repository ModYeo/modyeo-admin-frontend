import React, { useEffect } from "react";
import styled from "styled-components";

const ModalWindow = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  border-radius: 25px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const body = document.querySelector("body");

const lockViewScroll = () => {
  if (body) body.style.overflow = "hidden";
};

const unlockViewScroll = () => {
  if (body) body.style.overflow = "visible";
};

function Modal({
  children,
  width,
  height,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
}) {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  useEffect(() => {
    lockViewScroll();
    return () => unlockViewScroll();
  }, []);
  return (
    <ModalWindow onClick={stopPropagation} width={width} height={height}>
      {children}
    </ModalWindow>
  );
}

export default Modal;
