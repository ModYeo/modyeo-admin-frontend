import React, { useEffect } from "react";
import advertisementAPIManager from "../../modules/advertisementAPI";

function Advertisement() {
  useEffect(() => {
    (async () => {
      const fetchedAdvertisements =
        await advertisementAPIManager.fetchAllAdvertisement();
      console.log(fetchedAdvertisements);
      // TODO: make CRUD logic with dummy data.
    })();
  }, []);
  return <div>advertisement</div>;
}

export default Advertisement;
