import React from "react";
import useAdvertisement from "../../hooks/components/useAdvertisement";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";
import ModalContent from "../molcules/ModalContent";

function Advertisement() {
  const {
    advertisements,
    detailedAdvertisement,
    requiredInputItems,
    IS_ADVERTISEMENT_BEING_MODIFIED,
    registerNewAdvertisement,
    deleteAdvertisement,
    initializeDetailedAdvertisement,
    hideDetailedAdvertisementModal,
    toggleAdvertisementModificationModal,
    modifyAdvertisement,
  } = useAdvertisement();

  return (
    <ListContainer>
      <SubmitForm
        title="advertisements list"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewAdvertisement}
      />
      {advertisements.map((advertisement, index) => (
        <List key={advertisement.advertisementId}>
          <ListElement
            listElement={advertisement as unknown as ObjectType}
            elementId={advertisement.advertisementId}
            elementIndex={index}
            initializeDetailedElement={initializeDetailedAdvertisement}
            toggleModificationModal={toggleAdvertisementModificationModal}
            deleteElement={deleteAdvertisement}
          />
        </List>
      ))}
      {detailedAdvertisement && (
        <ModalBackground onClick={() => hideDetailedAdvertisementModal()}>
          <Modal width={400} height={200}>
            <ModalContent
              detailedElement={detailedAdvertisement as unknown as ObjectType}
            />
          </Modal>
        </ModalBackground>
      )}
      {IS_ADVERTISEMENT_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleAdvertisementModificationModal()}>
          <Modal width={400} height={200}>
            <SubmitForm
              title="notices list"
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyAdvertisement}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Advertisement;
