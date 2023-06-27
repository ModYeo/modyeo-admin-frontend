import React from "react";
import useAdvertisement from "../../hooks/components/useAdvertisement";

import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";

import { List, ListContainer } from "../../styles/styles";

function Advertisement() {
  const {
    advertisements,
    requiredInputItems,
    registerNewAdvertisement,
    deleteAdvertisement,
    initializeDetailedAdvertisement,
    toggleAdvertisementModificationModal,
  } = useAdvertisement();

  return (
    <ListContainer>
      <SubmitForm
        title="Advertisements List"
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
    </ListContainer>
  );
}

export default Advertisement;
