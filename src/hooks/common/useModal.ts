import { useCallback, useState } from "react";

function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = useCallback(
    () => setIsModalVisible((isModalVisibleState) => !isModalVisibleState),
    [setIsModalVisible],
  );

  return { isModalVisible, toggleModal };
}

export default useModal;
