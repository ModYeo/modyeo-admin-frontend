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
    detailedColumCode,
    requiredInputItems,
    IS_COLUMNCODE_BEING_MODIFIED,
    registerNewColumnCode,
    deleteColumnCode,
    initializeDetailedColumnCode,
    hideDetailedColumnCodeModal,
    toggleColumnCodeModificationModal,
    modifyColumnCode,
  } = useColumnCode();

  return (
    <ListContainer>
      <SubmitForm
        title="column codes list"
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
      {detailedColumCode && (
        <ModalBackground onClick={hideDetailedColumnCodeModal}>
          <Modal width={350} height={150}>
            <ModalContent
              detailedElement={detailedColumCode as unknown as ObjectType}
            />
          </Modal>
        </ModalBackground>
      )}
      {IS_COLUMNCODE_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleColumnCodeModificationModal()}>
          <Modal width={400} height={400}>
            <SubmitForm
              title="notices list"
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyColumnCode}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default ColumnCode;
