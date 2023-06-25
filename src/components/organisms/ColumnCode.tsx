import React from "react";
import useColumnCode from "../../hooks/components/useColumnCode";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";
import ModalContent from "../molcules/ModalContent";

function ColumnCode() {
  const {
    columnCodes,
    requiredInputItems,
    registerNewColumnCode,
    deleteColumnCode,
    initializeDetailedColumnCode,
    toggleColumnCodeModificationModal,
  } = useColumnCode();

  return (
    <ListContainer>
      <SubmitForm
        title="Column codes List"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewColumnCode}
      />
      {columnCodes.map((columnCode, index) => (
        <List key={columnCode.columnCodeId}>
          <ListElement
            listElement={columnCode as unknown as ObjectType}
            elementId={columnCode.columnCodeId}
            elementIndex={index}
            initializeDetailedElement={initializeDetailedColumnCode}
            toggleModificationModal={toggleColumnCodeModificationModal}
            deleteElement={deleteColumnCode}
          />
        </List>
      ))}
    </ListContainer>
  );
}

export default ColumnCode;
