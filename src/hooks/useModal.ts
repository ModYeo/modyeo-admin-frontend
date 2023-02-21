import { useState } from "react";

function useModal() {
  const [isModalUsed, setIsModalUsed] = useState(false);
  const toggleModal = () => setIsModalUsed(!isModalUsed);
  return { isModalUsed, toggleModal };
}

export default useModal;
