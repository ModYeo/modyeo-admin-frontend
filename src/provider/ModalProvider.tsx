import React, { createContext, useCallback, useState } from "react";

import useModal from "../hooks/common/useModal";

import Modal from "../components/commons/Modal";
import SubmitForm, {
  RequiredInputItem,
} from "../components/molcules/SubmitForm";
import { ObjectType } from "../components/atoms/Card";
import ModalContent from "../components/molcules/ModalContent";

import { ModalBackground } from "../styles/styles";

type ElementModificationFunction = (
  e: React.FormEvent<HTMLFormElement>,
) => Promise<void>;

interface ModalContext {
  isModalVisible: boolean;
  closeModalAndInitializeModificationForm: () => void;
  injectDetailedElement: (detailedElementParam: ObjectType) => void;
  injectModificationModels: (modificationParam?: {
    requiredInputElementsParam: RequiredInputItem[];
    elementModificationFunctionParam: ElementModificationFunction;
  }) => void;
}

const MODAL_CONTEXT = createContext<ModalContext>({
  isModalVisible: false,
  closeModalAndInitializeModificationForm: () => null,
  injectDetailedElement: () => null,
  injectModificationModels: () => null,
});

function ModalProvider({ children }: { children: React.ReactNode }) {
  const { isModalVisible, showModal, hideModal } = useModal();

  // const {} = useAlert();

  // const {} = useConfirm();

  const [detailedElement, setDetailedElement] = useState<ObjectType | null>(
    null,
  );

  const [requiredInputElements, setRequiredInputElements] = useState<
    RequiredInputItem[] | null
  >(null);

  const [elementModificationFunction, setElementModificationFuction] =
    useState<ElementModificationFunction | null>(null);

  const injectDetailedElement = useCallback(
    (detailedElementParam: ObjectType | null) => {
      setDetailedElement(detailedElementParam);
      showModal();
    },
    [setDetailedElement, showModal],
  );

  const closeModalAndInitializeModificationForm = useCallback(() => {
    setRequiredInputElements(null);
    setElementModificationFuction(null);
    setDetailedElement(null);
    hideModal();
  }, [hideModal]);

  const injectModificationModels = useCallback(
    (modificationParam?: {
      requiredInputElementsParam: RequiredInputItem[];
      elementModificationFunctionParam: ElementModificationFunction;
    }) => {
      if (modificationParam) {
        const { requiredInputElementsParam, elementModificationFunctionParam } =
          modificationParam;
        setRequiredInputElements(requiredInputElementsParam);
        setElementModificationFuction(() => elementModificationFunctionParam);
      } else {
        closeModalAndInitializeModificationForm();
      }
      showModal();
    },
    [closeModalAndInitializeModificationForm, showModal],
  );

  return (
    <MODAL_CONTEXT.Provider
      value={{
        isModalVisible,
        closeModalAndInitializeModificationForm,
        injectDetailedElement,
        injectModificationModels,
      }}
    >
      {children}
      <ModalBackground
        onClick={closeModalAndInitializeModificationForm}
        isModalVisible={isModalVisible}
      >
        <Modal>
          {detailedElement && (
            <ModalContent detailedElement={detailedElement} />
          )}
          {requiredInputElements && elementModificationFunction && (
            <SubmitForm
              requiredInputItems={requiredInputElements}
              registerNewElement={elementModificationFunction}
              isModificationAction={true}
            />
          )}
        </Modal>
      </ModalBackground>
    </MODAL_CONTEXT.Provider>
  );
}

export default ModalProvider;
export { MODAL_CONTEXT };
