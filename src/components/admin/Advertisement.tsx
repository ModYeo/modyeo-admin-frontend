import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { toastSentences } from "../../constants/toastSentences";
import advertisementAPIManager from "../../modules/advertisementAPI";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import { IAdvertisement, IDetailedAdvertisement } from "../../type/types";
import Modal from "../commons/Modal";

function Advertisement() {
  const [advertisements, setAdvertisements] = useState<Array<IAdvertisement>>(
    [],
  );
  const [clickedAdvertisement, setClickedAdvertisement] =
    useState<IDetailedAdvertisement | null>(null);
  const [clickedAdvertisementIndex, setClickedAdvertisementIndex] =
    useState(-1);
  const advertisementNameInputRef = useRef<HTMLInputElement>(null);
  const urlLinkInputRef = useRef<HTMLInputElement>(null);
  const handleOnAdFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const advertisementNameInputValue =
      advertisementNameInputRef.current?.value;
    const urlLinkInputValue = urlLinkInputRef.current?.value;
    if (advertisementNameInputValue && urlLinkInputValue) {
      if (!advertisementAPIManager.checkUrlLinkValidation(urlLinkInputValue)) {
        toast.error(toastSentences.advertisement.urlLinkInvalid);
        return;
      }
      if (clickedAdvertisementIndex === -1) {
        const advertisementId =
          await advertisementAPIManager.makeNewAdvertisement(
            advertisementNameInputValue,
            urlLinkInputValue,
          );
        if (advertisementId) {
          const newAdvertisement: IAdvertisement = {
            advertisementId,
            advertisementName: advertisementNameInputValue,
            urlLink: urlLinkInputValue,
            imagePath: "",
            useYn: null,
            type: null,
          };
          setAdvertisements([newAdvertisement, ...advertisements]);
        }
      } else {
        const modifiedAdvertisementId =
          await advertisementAPIManager.modifyAdvertisement(
            advertisementNameInputValue,
            urlLinkInputValue,
            advertisements[clickedAdvertisementIndex].advertisementId,
          );
        if (modifiedAdvertisementId) {
          setAdvertisements((nowAdvertisements) => {
            const targetAdvertisement =
              nowAdvertisements[clickedAdvertisementIndex];
            targetAdvertisement.advertisementName = advertisementNameInputValue;
            targetAdvertisement.urlLink = urlLinkInputValue;
            return [...nowAdvertisements];
          });
          setClickedAdvertisementIndex(-1);
        }
      }
    }
  };
  const deleteAdvertisement = async (
    advertisementId: number,
    index: number,
  ) => {
    const confirmAdvertisementDelete =
      window.confirm("정말 이 광고를 삭제하시겠습니까?");
    if (!confirmAdvertisementDelete) return;
    const isDeleteSuccessful =
      await advertisementAPIManager.deleteAdvertisement(advertisementId);
    if (isDeleteSuccessful) {
      advertisements.splice(index, 1);
      setAdvertisements([...advertisements]);
    }
  };
  const fetchDetailedAdvertisement = async (advertisementId: number) => {
    const detailedAdvertisementInfo =
      await advertisementAPIManager.fetchDetailedAdvertisement(advertisementId);
    if (detailedAdvertisementInfo)
      setClickedAdvertisement(detailedAdvertisementInfo);
  };
  useEffect(() => {
    (async () => {
      const fetchedAdvertisements =
        await advertisementAPIManager.fetchAllAdvertisement();
      if (fetchedAdvertisements) setAdvertisements(fetchedAdvertisements);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>advertisement list</h5>
      <br />
      <form onSubmit={handleOnAdFormSubmit}>
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
              onClick={() => setClickedAdvertisementIndex(index)}
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
      {clickedAdvertisement && (
        <ModalBackground onClick={() => setClickedAdvertisement(null)}>
          <Modal width={300} height={200}>
            <div>
              <h5>ad name {clickedAdvertisement.advertisementName}</h5>
            </div>
            &emsp;
            <div>
              <h5>created by {clickedAdvertisement.createdBy}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
      {clickedAdvertisementIndex !== -1 && (
        <ModalBackground onClick={() => setClickedAdvertisementIndex(-1)}>
          <Modal width={600} height={200}>
            <form onSubmit={handleOnAdFormSubmit}>
              <CreateInput
                placeholder="advertisement name"
                defaultValue={
                  advertisements[clickedAdvertisementIndex].advertisementName
                }
                ref={advertisementNameInputRef}
                required
              />
              <CreateInput
                placeholder="url link"
                defaultValue={advertisements[clickedAdvertisementIndex].urlLink}
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
