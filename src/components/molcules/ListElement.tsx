import React from "react";
import Card from "../atoms/Card";

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
      <div>
        {initializeDetailedElement && (
          <button
            type="button"
            onClick={() => initializeDetailedElement(elementId)}
          >
            about
          </button>
        )}
        {toggleModificationModal && (
          <button
            type="button"
            onClick={() => toggleModificationModal(elementIndex)}
          >
            modify
          </button>
        )}
        {deleteElement && (
          <button
            type="button"
            onClick={() => deleteElement(elementId, elementIndex)}
          >
            delete
          </button>
        )}
      </div>
    </div>
  );
}

export default ListElement;
