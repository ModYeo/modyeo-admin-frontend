import React from "react";
import { ColumnKey, ColumnValue } from "../../styles/styles";

type ObjectType = { [key: string]: string | number };

function Card({ element }: { element: ObjectType }) {
  return (
    <div>
      {Object.keys(element).map((key) => {
        if (key.toLocaleLowerCase().includes("id")) return null;
        return (
          <div key={key}>
            <ColumnKey>{`${key} - `}</ColumnKey>
            <ColumnValue>{element[key]}</ColumnValue>
          </div>
        );
      })}
    </div>
  );
}

export default Card;
export type { ObjectType };
