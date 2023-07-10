import React from "react";
import styled from "styled-components";
import COLOR_CONST from "../../constants/colorConst";

type ObjectType = { [key: string]: string | number };

const ListElementWrapper = styled.li`
  @keyframes swing {
    25% {
      transform: translateX(10px);
    }
    50% {
      transform: translateX(-10px);
    }
    75% {
      transform: translateX(10px);
    }
    100% {
      transform: translateX(0px);
    }
  }
  justify-content: space-between;
  & > div:first-child > span:first-child {
    color: grey;
    font-size: 13px;
  }
  &:hover > div:first-child > span:last-child {
    color: #5476d7;
  }
  & > div:last-child {
    padding-right: 20px;
    color: #5476d7;
  }
  &:hover > div:last-child {
    animation: swing 1s;
  }
`;

function ListElement({
  object,
  index,
  title,
}: {
  object: ObjectType;
  index: number;
  title: string;
}) {
  const tmpTitle = String(object[title]);
  const previewTitle =
    tmpTitle.length > 50 ? `${tmpTitle.slice(0, 50)}...` : tmpTitle;
  return (
    <ListElementWrapper>
      <div>
        <span>{index + 1}</span>
        &nbsp; - &nbsp;
        <span>{previewTitle}</span>
      </div>
      <div>&rarr;</div>
    </ListElementWrapper>
  );
}

export default ListElement;
