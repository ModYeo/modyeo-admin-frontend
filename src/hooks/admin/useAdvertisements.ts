/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import NOT_EXISTS from "../../constants/notExists";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import { IAdvertisement, IDetailedAdvertisement } from "../../type/types";

// const AD_TYPE = "ARTICLE";

// const urlLinkRegex =
//   // eslint-disable-next-line no-useless-escape
//   /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

// const checkUrlLinkValidation = (urlLink: string) => {
//   return urlLinkRegex.test(urlLink);
// };

interface UseAdvertisements {
  advertisements: Array<IAdvertisement>;
  detailedAdvertisement: IDetailedAdvertisement | null;
  clickedAdvertisementIndex: number;
  fetchAdvertisements: () => Promise<IAdvertisement[] | null>;
}

const useAdvertisements = (): UseAdvertisements => {
  const [advertisements, setAdvertisements] = useState<Array<IAdvertisement>>(
    [],
  );
  const [detailedAdvertisement, setDetailedAdvertisement] =
    useState<IDetailedAdvertisement | null>(null);
  const [clickedAdvertisementIndex, setClickedAdvertisementIndex] =
    useState(NOT_EXISTS);

  const fetchAdvertisements = useCallback(async () => {
    const fetchedAdvertisements = await apiManager.fetchData<IAdvertisement>(
      routes.server.advertisement,
    );
    return fetchedAdvertisements;
  }, []);

  const registerNewAdvertisement = () => {};

  return {
    advertisements,
    detailedAdvertisement,
    clickedAdvertisementIndex,
    fetchAdvertisements,
  };
};

export default useAdvertisements;
