import React, { useEffect, useRef, useState } from "react";
import NOT_EXISTS from "../../constants/notExists";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import { ICollection } from "../../type/types";
import Modal from "../commons/Modal";

function Collection() {
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [clickedCollectionIndex, setClickedCollectionIndex] =
    useState(NOT_EXISTS);
  const nameInfoTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const descTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleOnCollectionFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const nameInfoTextAreaValue = nameInfoTextAreaRef.current?.value;
    const descTextAreaValue = descTextAreaRef.current?.value;
    let isAPICallSuccessful = false;
    if (nameInfoTextAreaValue && descTextAreaValue) {
      if (clickedCollectionIndex === NOT_EXISTS) {
        const newCollectionId = await apiManager.postNewDataElem(
          routes.server.collection,
          {
            collectionInfoId: 0,
            collectionInfoName: nameInfoTextAreaValue,
            description: descTextAreaValue,
          },
        );
        if (newCollectionId) {
          const newCollection: ICollection = {
            collectionInfoId: newCollectionId,
            collectionInfoName: nameInfoTextAreaValue,
            description: descTextAreaValue,
          };
          setCollections([newCollection, ...collections]);
          isAPICallSuccessful = true;
        }
      } else {
        const modifiedCollectionId = await apiManager.modifyData(
          routes.server.collection,
          {
            collectionInfoId:
              collections[clickedCollectionIndex].collectionInfoId,
            collectionInfoName: nameInfoTextAreaValue,
            description: descTextAreaValue,
          },
        );
        if (modifiedCollectionId) {
          const modifiedCollection: ICollection = {
            collectionInfoId: modifiedCollectionId,
            collectionInfoName: nameInfoTextAreaValue,
            description: descTextAreaValue,
          };
          collections.splice(clickedCollectionIndex, 1, modifiedCollection);
          setCollections([...collections]);
          setClickedCollectionIndex(NOT_EXISTS);
          isAPICallSuccessful = true;
        }
      }
      if (isAPICallSuccessful) {
        nameInfoTextAreaRef.current.value = "";
        descTextAreaRef.current.value = "";
      }
    }
  };
  const deleteCollection = async (collectionInfoId: number, index: number) => {
    const confirmCollectionDelete =
      window.confirm("???????????? ?????????????????????????");
    if (!confirmCollectionDelete) return;
    const isCollectionDeleted = await apiManager.deleteData(
      routes.server.collection,
      collectionInfoId,
    );
    if (isCollectionDeleted) {
      collections.splice(index, 1);
      setCollections([...collections]);
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedCollections = await apiManager.fetchData<ICollection>(
        routes.server.collection,
      );
      if (fetchedCollections) setCollections(fetchedCollections);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>collection list</h5>
      <br />
      <form onSubmit={handleOnCollectionFormSubmit}>
        <textarea placeholder="info name" ref={nameInfoTextAreaRef} required />
        <textarea placeholder="desc" ref={descTextAreaRef} required />
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
                onClick={() => setClickedCollectionIndex(index)}
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
      {clickedCollectionIndex !== NOT_EXISTS && (
        <ModalBackground onClick={() => setClickedCollectionIndex(NOT_EXISTS)}>
          <Modal width={500} height={500}>
            <form onSubmit={handleOnCollectionFormSubmit}>
              <textarea
                placeholder="info name"
                ref={nameInfoTextAreaRef}
                defaultValue={
                  collections[clickedCollectionIndex].collectionInfoName
                }
                required
              />
              <textarea
                placeholder="desc"
                ref={descTextAreaRef}
                defaultValue={collections[clickedCollectionIndex].description}
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
