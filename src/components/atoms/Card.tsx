import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Column = styled.div`
  margin-bottom: 10px;
`;

const ColumnKey = styled.span`
  color: #b5b5b5;
`;

const ColumnValue = styled.span`
  color: black;
`;

const LinkHrefValue = styled.span`
  font-size: 13.5px;
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin-top: 15px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
`;

type ObjectType = { [key: string]: string | number };

const checkIsVaildElementValue = (
  element: ObjectType,
  key: string,
): boolean => {
  const elementValue = element[key];
  if (elementValue === null) return false;
  if (key.toLocaleLowerCase().includes("id")) return false;
  return true;
};

function Image({ src }: { src: string }) {
  return (
    <ImageWrapper>
      <LazyLoadImage
        src="https://i.pravatar.cc/300"
        alt={`img ${src}`}
        width={80}
        height={80}
      />
    </ImageWrapper>
  );
}

function JSXElementByKey({
  elementKey,
  elementValue,
}: {
  elementKey: string;
  elementValue: string | number;
}) {
  if (typeof elementValue === "string" && elementKey === "imagePath") {
    return <Image src={elementValue} />;
  }
  if (typeof elementValue === "string" && elementKey === "urlLink") {
    return (
      <>
        <ColumnKey>{`${elementKey} - `}</ColumnKey>
        <a href={elementValue} target="_blank" rel="noreferrer">
          <LinkHrefValue>{elementValue}</LinkHrefValue>
        </a>
      </>
    );
  }
  return (
    <Column>
      <ColumnKey>{`${elementKey} - `}</ColumnKey>
      <ColumnValue>
        {Array.isArray(elementValue)
          ? JSON.stringify(elementValue)
          : elementValue}
      </ColumnValue>
    </Column>
  );
}

function Card({ element }: { element: ObjectType }) {
  return (
    <div>
      {Object.keys(element).map((key) => {
        const isValidElementValue = checkIsVaildElementValue(element, key);
        if (!isValidElementValue) return null;
        return (
          <div key={key}>
            <JSXElementByKey elementKey={key} elementValue={element[key]} />
          </div>
        );
      })}
    </div>
  );
}

export default Card;
export type { ObjectType };
