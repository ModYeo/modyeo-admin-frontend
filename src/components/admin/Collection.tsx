import React, { useEffect, useRef, useState } from "react";
import routes from "../../constants/routes";
import collectionAPIManager from "../../modules/apiManager";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import { ICollection } from "../../type/types";
import Modal from "../commons/Modal";

function Collection() {
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [clickedCollectionIndex, setClickedCollectionIndex] = useState(-1);
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
      if (clickedCollectionIndex === -1) {
        const newCollectionId = await collectionAPIManager.postNewDataElem(
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
        const modifiedCollectionId = await collectionAPIManager.modifyData(
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
          setClickedCollectionIndex(-1);
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
      window.confirm("컬렉션을 삭제하시겠습니까?");
    if (!confirmCollectionDelete) return;
    const isCollectionDeleted = await collectionAPIManager.deleteData(
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
      const fetchedCollections =
        await collectionAPIManager.fetchData<ICollection>(
          routes.server.collection,
        );
      if (fetchedCollections) setCollections(fetchedCollections);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>column codes list</h5>
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
      {clickedCollectionIndex !== -1 && (
        <ModalBackground onClick={() => setClickedCollectionIndex(-1)}>
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
