import React from "react";

type ObjectType = { [key: string]: string | number };

function Card({ element }: { element: ObjectType }) {
  return (
    <div>
      {Object.keys(element).map((key) => {
        if (key.includes("id")) return null;
        return <div key={key}>{`${key} - ${element[key]}`}</div>;
      })}
    </div>
  );
}

export default Card;
export type { ObjectType };
