import { useCallback, useEffect, useState } from "react";

const body = document.querySelector("body");

const lockViewScroll = () => {
  if (body) body.style.overflow = "hidden";
};

const unlockViewScroll = () => {
  if (body) body.style.overflow = "visible";
};

function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = useCallback(
    () => setIsModalVisible(true),
    [setIsModalVisible],
  );

  const hideModal = useCallback(
    () => setIsModalVisible(false),
    [setIsModalVisible],
  );

  useEffect(() => {
    if (isModalVisible) lockViewScroll();
    else unlockViewScroll();
  }, [isModalVisible]);

  return { isModalVisible, showModal, hideModal };
}

export default useModal;
