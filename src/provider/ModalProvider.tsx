import React, { createContext } from "react";
import useModal from "../hooks/common/useModal";

interface IModalProvider {
  isModalVisible: boolean;
  toggleModal: () => void;
}

const MODAL_PROVIDER = createContext<IModalProvider | null>(null);

function ModalProvider({ children }: { children: React.ReactNode }) {
  const { isModalVisible, toggleModal } = useModal();
  return (
    <MODAL_PROVIDER.Provider value={{ isModalVisible, toggleModal }}>
      {children}
    </MODAL_PROVIDER.Provider>
  );
}

export default ModalProvider;
