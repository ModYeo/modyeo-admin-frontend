import React, { useEffect } from "react";
import useAdvertisement from "../../hooks/components/useAdvertisement";
import Modal from "../commons/Modal";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";

function Advertisement() {
  const {
    advertisements,
    detailedAdvertisement,
    toBeModifiedAdvertisementIndex,
    advertisementNameInputRef,
    urlLinkInputRef,
    isAdvertisementBeingModified,
    fetchAdvertisements,
    registerNewAdvertisement,
    deleteAdvertisement,
    fetchDetailedAdvertisement,
    hideDetailedAdvertisementModal,
    toggleAdvertisementModificationModal,
    modifyAdvertisement,
  } = useAdvertisement();

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  return (
    <ListContainer>
      <h5>advertisement list</h5>
      <br />
      <form onSubmit={registerNewAdvertisement}>
        <CreateInput
          placeholder="advertisement name"
          ref={advertisementNameInputRef}
          required
        />
        <CreateInput placeholder="url link" ref={urlLinkInputRef} required />
        <button type="submit">add a advertisemnet</button>
      </form>
      <br />
      {advertisements.map((advertisement, index) => (
        <List key={advertisement.advertisementId}>
          <div>
            <div>name - {advertisement.advertisementName}</div>
            <div>url link - {advertisement.urlLink}</div>
          </div>
          <span>
            <button
              type="button"
              onClick={() =>
                fetchDetailedAdvertisement(advertisement.advertisementId)
              }
            >
              about
            </button>
            <button
              type="button"
              onClick={() => toggleAdvertisementModificationModal(index)}
            >
              modify
            </button>
            <button
              type="button"
              onClick={() =>
                deleteAdvertisement(advertisement.advertisementId, index)
              }
            >
              delete
            </button>
          </span>
        </List>
      ))}
      {detailedAdvertisement && (
        <ModalBackground onClick={hideDetailedAdvertisementModal}>
          <Modal width={300} height={200}>
            <div>
              <h5>ad name {detailedAdvertisement.advertisementName}</h5>
            </div>
            &emsp;
            <div>
              <h5>created by {detailedAdvertisement.createdBy}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
      {isAdvertisementBeingModified && (
        <ModalBackground onClick={() => toggleAdvertisementModificationModal()}>
          <Modal width={600} height={200}>
            <form onSubmit={modifyAdvertisement}>
              <CreateInput
                placeholder="advertisement name"
                defaultValue={
                  advertisements[toBeModifiedAdvertisementIndex]
                    .advertisementName
                }
                ref={advertisementNameInputRef}
                required
              />
              <CreateInput
                placeholder="url link"
                defaultValue={
                  advertisements[toBeModifiedAdvertisementIndex].urlLink
                }
                ref={urlLinkInputRef}
                required
              />
              <button type="submit">modify advertisement</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Advertisement;
