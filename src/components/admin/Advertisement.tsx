import React, { useEffect, useRef } from "react";
import advertisementAPIManager from "../../modules/advertisementAPI";
import { CreateInput, ListContainer } from "../../styles/styles";

function Advertisement() {
  const advertisementNameInputRef = useRef<HTMLInputElement>(null);
  const urlLinkInputRef = useRef<HTMLInputElement>(null);
  const handleOnAdFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const advertisementNameInputValue =
      advertisementNameInputRef.current?.value;
    const urlLinkInputValue = urlLinkInputRef.current?.value;
    if (advertisementNameInputValue && urlLinkInputValue) {
      const advertisementId =
        await advertisementAPIManager.makeNewAdvertisement(
          advertisementNameInputValue,
          urlLinkInputValue,
        );
      console.log(advertisementId);
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedAdvertisements =
        await advertisementAPIManager.fetchAllAdvertisement();
      console.log(fetchedAdvertisements);
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
        />
        <CreateInput placeholder="url link" ref={urlLinkInputRef} />
        <button type="submit">add a advertisemnet</button>
      </form>
      <br />
    </ListContainer>
  );
}

export default Advertisement;
