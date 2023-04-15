import React from "react";
import Card from "../atoms/Card";
import { Button } from "../../styles/styles";

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
    <div>
      <Card element={listElement} />
      {/* <br /> */}
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
    </div>
  );
}

export default ListElement;
