/* eslint-disable react/button-has-type */
import React from "react";
import styled from "styled-components";
import COLOR_CONST from "../../constants/colorConst";

type Sizes = "sm" | "md" | "lg";

type BgColors = "blue" | "red" | "grey";

const StyledButton = styled.button<{
  size: Sizes;
  bgColor: BgColors;
  isChosen?: boolean;
  disabled?: boolean;
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
        return `${isChosen ? "white" : COLOR_CONST.BLUE}`;
      case "red":
        return `${isChosen ? "white" : COLOR_CONST.RED}`;
      default:
        return `${isChosen ? "white" : COLOR_CONST.GRAY}`;
    }
  }};
  color: ${({ bgColor, isChosen }) => {
    switch (bgColor) {
      case "blue":
        return `${isChosen ? COLOR_CONST.BLUE : "white"}`;
      case "red":
        return `${isChosen ? COLOR_CONST.RED : "white"}`;
      default:
        return `${isChosen ? COLOR_CONST.GRAY : "white"}`;
    }
  }};
  border: ${({ bgColor, isChosen }) => {
    switch (bgColor) {
      case "blue":
        return `1px solid ${isChosen ? COLOR_CONST.BLUE : "white"}`;
      case "red":
        return `1px solid ${isChosen ? COLOR_CONST.RED : "white"}`;
      default:
        return `1px solid ${isChosen ? COLOR_CONST.GRAY : "white"}`;
    }
  }};
  opacity: ${({ disabled }) => {
    return disabled ? "0.35" : "1";
  }};
  cursor: ${({ disabled }) => {
    return disabled ? "not-allowed" : "pointer";
  }};
  border-radius: 8px;
  transition: all 1s;
  &:hover {
    opacity: ${({ disabled }) => {
      return disabled ? "0.35" : "0.8";
    }};
  }
`;

interface ButtonInterface {
  type: "button" | "submit";
  bgColor: BgColors;
  size: Sizes;
  isChosen?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (...args: any) => void;
}

function Button({
  type,
  bgColor,
  size,
  isChosen,
  disabled,
  children,
  onClick,
}: ButtonInterface) {
  return (
    <StyledButton
      type={type}
      bgColor={bgColor}
      size={size}
      isChosen={isChosen}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
