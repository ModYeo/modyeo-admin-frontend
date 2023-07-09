/* eslint-disable react/button-has-type */
import React from "react";
import styled from "styled-components";

type Sizes = "sm" | "md" | "lg";

type BgColors = "blue" | "red" | "grey";

const StyledButton = styled.button<{
  size: Sizes;
  bgColor: BgColors;
}>`
  width: ${({ size }) => {
    switch (size) {
      case "sm":
        return "60px";
      case "md":
        return "100px";
      case "lg":
        return "150px";
      default:
        return "100px";
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case "sm":
        return "25px";
      case "md":
        return "40px";
      case "lg":
        return "55px";
      default:
        return "40px";
    }
  }};
  background-color: ${({ bgColor }) => {
    switch (bgColor) {
      case "blue":
        return "#5476d7";
      case "red":
        return "#e84b35";
      default:
        return "#b5b5b5";
    }
  }};
  color: white;
  border-radius: 8px;
  &:hover {
    opacity: 0.8;
  }
  transition: all 1s;
`;

interface ButtonInterface {
  type: "button" | "submit";
  bgColor: BgColors;
  size: Sizes;
  children: React.ReactNode;
}

function Button({ type, bgColor, size, children }: ButtonInterface) {
  return (
    <StyledButton type={type} bgColor={bgColor} size={size}>
      {children}
    </StyledButton>
  );
}

export default Button;
