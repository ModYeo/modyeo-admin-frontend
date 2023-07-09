import React from "react";

import styled from "styled-components";

import Card from "../atoms/Card";
import { Button } from "../../styles/styles";

const ListElemInnerWrapper = styled.div`
  & Button {
    opacity: 0;
  }
  & Button:first-child {
    transition: all 0.5s;
  }
  & Button:nth-child(2) {
    transition: all 1s;
  }
  & Button:last-child {
    transition: all 1.5s;
  }
  &:hover {
    & Button {
      opacity: 1;
    }
  }
  & > div:last-child {
    text-align: right;
  }
`;

type ObjectType = { [key: string]: string | number };

interface ListElementInterface {
  listElement: ObjectType;
  elementId: number;
  elementIndex: number;
  initializeDetailedElement?:
    | ((elementId: number) => Promise<void>)
    | undefined;
  toggleModificationModal?:
    | ((targetElementIndex?: number | undefined) => void)
    | undefined;
  deleteElement?:
    | ((elementId: number, targetElementIndex: number) => Promise<void>)
    | undefined;
}

function ListElement({
  listElement,
  elementId,
  elementIndex,
  initializeDetailedElement,
  toggleModificationModal,
  deleteElement,
}: ListElementInterface) {
  return (
    <ListElemInnerWrapper>
      <Card element={listElement} />
      <br />
      <div>
        {initializeDetailedElement && (
          <Button
            type="button"
            onClick={() => initializeDetailedElement(elementId)}
          >
            about
          </Button>
        )}
        {toggleModificationModal && (
          <Button
            type="button"
            onClick={() => toggleModificationModal(elementIndex)}
          >
            modify
          </Button>
        )}
        {deleteElement && (
          <Button
            type="button"
            onClick={() => deleteElement(elementId, elementIndex)}
          >
            delete
          </Button>
        )}
      </div>
    </ListElemInnerWrapper>
  );
}

export default ListElement;
