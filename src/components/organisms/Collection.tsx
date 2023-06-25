import React from "react";
import useCollection from "../../hooks/components/useCollection";
import { List, ListContainer } from "../../styles/styles";
import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";

function Collection() {
  const {
    collections,
    requiredInputItems,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModal,
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
            toggleModificationModal={toggleCollectionModificationModal}
            deleteElement={deleteCollection}
          />
        </List>
      ))}
    </ListContainer>
  );
}

export default Collection;
