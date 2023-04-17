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

const checkIsVaildElementValue = (
  element: ObjectType,
  key: string,
): boolean => {
  const elementValue = element[key];
  if (elementValue === null) return false;
  if (key.toLocaleLowerCase().includes("id")) return false;
  if (Array.isArray(elementValue)) return false;
  return true;
};

function Card({ element }: { element: ObjectType }) {
  return (
    <div>
      {Object.keys(element).map((key) => {
        const isValidElementValue = checkIsVaildElementValue(element, key);
        return (
          <div key={key}>
            {isValidElementValue && (
              <Column>
                <ColumnKey>{`${key} - `}</ColumnKey>
                <ColumnValue>{element[key]}</ColumnValue>
              </Column>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Card;
export type { ObjectType };
