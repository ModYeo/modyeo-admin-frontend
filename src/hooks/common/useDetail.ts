import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import apiManager from "../../modules/apiManager";

const useDetail = <T>(path: string) => {
  const { pathname } = useLocation();

  const [detailedData, setDetailedData] = useState<T | null>(null);

  const elementId = useMemo(
    () => pathname.split("/")[2],
    [pathname],
  ) as unknown as number;

  const fetchDetailedData = useCallback(() => {
    return apiManager.fetchDetailedData<T>(path, elementId);
  }, [path, elementId]);

  const initializeDetailedData = useCallback(async () => {
    const fetchedDetailedData = await fetchDetailedData();
    if (fetchedDetailedData) setDetailedData(fetchedDetailedData);
  }, [fetchDetailedData]);

  useEffect(() => {
    if (Number.isNaN(Number(elementId))) {
      toast.error("Element found");
    } else {
      initializeDetailedData();
    }
  }, [elementId, initializeDetailedData]);

  return {
    detailedData,
  };
};

export default useDetail;
