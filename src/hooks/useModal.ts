import { useState } from "react";

/* !!현재 사용하지 않는 커스텀 훅!! */
function useModal() {
  const [isModalUsed, setIsModalUsed] = useState(false);
  const toggleModal = () => setIsModalUsed(!isModalUsed);
  return { isModalUsed, toggleModal };
}

export default useModal;
