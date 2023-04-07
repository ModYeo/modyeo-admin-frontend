import React, { useEffect } from "react";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import useCollection from "../../hooks/components/useCollection";
import Modal from "../commons/Modal";

function Collection() {
  const {
    collections,
    toBeModifiedCollectionIndex,
    collectionInfoNameTextAreaRef,
    collectionDescTextAreaRef,
    isCollectionBeingModified,
    initializeAdvertisementsList,
    registerNewCollection,
    deleteCollection,
    toggleCollectionModificationModal,
    modifyCollection,
  } = useCollection();

  useEffect(() => {
    initializeAdvertisementsList();
  }, [initializeAdvertisementsList]);

  return (
    <ListContainer>
      <h5>collection list</h5>
      <br />
      <form onSubmit={registerNewCollection}>
        <textarea
          placeholder="info name"
          ref={collectionInfoNameTextAreaRef}
          required
        />
        <textarea placeholder="desc" ref={collectionDescTextAreaRef} required />
        <button type="submit">make a new collection info</button>
      </form>
      <br />
      {collections.map((collection, index) => (
        <List key={collection.collectionInfoId}>
          <span>
            <div>{collection.collectionInfoName}</div>
            <br />
            <div>{collection.description}</div>
            <div>
              <button
                type="button"
                onClick={() => toggleCollectionModificationModal(index)}
              >
                modify
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteCollection(collection.collectionInfoId, index)
                }
              >
                delete
              </button>
            </div>
          </span>
        </List>
      ))}
      {isCollectionBeingModified && (
        <ModalBackground onClick={() => toggleCollectionModificationModal()}>
          <Modal width={500} height={500}>
            <form onSubmit={modifyCollection}>
              <textarea
                placeholder="info name"
                ref={collectionInfoNameTextAreaRef}
                defaultValue={
                  collections[toBeModifiedCollectionIndex].collectionInfoName
                }
                required
              />
              <textarea
                placeholder="desc"
                ref={collectionDescTextAreaRef}
                defaultValue={
                  collections[toBeModifiedCollectionIndex].description
                }
                required
              />
              <button type="submit">modify collection info</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Collection;
