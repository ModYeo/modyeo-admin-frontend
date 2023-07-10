/* eslint-disable react/button-has-type */
import React from "react";
import styled from "styled-components";

type Sizes = "sm" | "md" | "lg";

type BgColors = "blue" | "red" | "grey";

const StyledButton = styled.button<{
  size: Sizes;
  bgColor: BgColors;
  isChosen?: boolean;
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
  background-color: ${({ bgColor, isChosen }) => {
    switch (bgColor) {
      case "blue":
        return `${isChosen ? "white" : "#5476d7"}`;
      case "red":
        return `${isChosen ? "white" : "#e84b35"}`;
      default:
        return `${isChosen ? "white" : "#b5b5b5"}`;
    }
  }};
  color: ${({ bgColor, isChosen }) => {
    switch (bgColor) {
      case "blue":
        return `${isChosen ? "#5476d7" : "white"}`;
      case "red":
        return `${isChosen ? "#e84b35" : "white"}`;
      default:
        return `${isChosen ? "#b5b5b5" : "white"}`;
    }
  }};
  border: ${({ bgColor, isChosen }) => {
    switch (bgColor) {
      case "blue":
        return `1px solid ${isChosen ? "#5476d7" : "white"}`;
      case "red":
        return `1px solid ${isChosen ? "#e84b35" : "white"}`;
      default:
        return `1px solid ${isChosen ? "#b5b5b5" : "white"}`;
    }
  }};
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
  isChosen?: boolean;
  children: React.ReactNode;
  onClick?: (...args: any) => void;
}

function Button({
  type,
  bgColor,
  size,
  isChosen,
  children,
  onClick,
}: ButtonInterface) {
  return (
    <StyledButton
      type={type}
      bgColor={bgColor}
      size={size}
      isChosen={isChosen}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
