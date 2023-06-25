import React from "react";
import useCollection from "../../hooks/components/useCollection";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";

function Collection() {
  const {
    collections,
    requiredInputItems,
    IS_COLLECTION_BEING_MODIFIED,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModalSecond,
    modifyCollection,
  } = useCollection();

  return (
    <ListContainer>
      <SubmitForm
        title="Collections List"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewCollection}
      />
      {collections.map((collection, index) => (
        <List key={collection.collectionInfoId}>
          <ListElement
            listElement={collection as unknown as ObjectType}
            elementId={collection.collectionInfoId}
            elementIndex={index}
            toggleModificationModal={toggleCollectionModificationModalSecond}
            deleteElement={deleteCollection}
          />
        </List>
      ))}
      {/* {IS_COLLECTION_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleCollectionModificationModal()}>
          <Modal>
            <SubmitForm
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyCollection}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )} */}
    </ListContainer>
  );
}

export default Collection;
