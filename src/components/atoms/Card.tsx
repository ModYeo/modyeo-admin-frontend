import React from "react";
import styled from "styled-components";

const Column = styled.div`
  margin-bottom: 10px;
`;

const ColumnKey = styled.span`
  color: #b5b5b5;
`;

const ColumnValue = styled.span`
  color: black;
`;

type ObjectType = { [key: string]: string | number };

function Card({ element }: { element: ObjectType }) {
  return (
    <div>
      {Object.keys(element).map((key) => {
        if (key.toLocaleLowerCase().includes("id")) return null;
        if (Array.isArray(element[key])) return null;
        return (
          <Column key={key}>
            <ColumnKey>{`${key} - `}</ColumnKey>
            <ColumnValue>{element[key]}</ColumnValue>
          </Column>
        );
      })}
    </div>
  );
}

export default Card;
export type { ObjectType };
